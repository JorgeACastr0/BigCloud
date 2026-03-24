require('dotenv').config();
const axios = require('axios');
const https = require('https');

class ProxmoxService {
  constructor() {
    this.host = process.env.PROXMOX_HOST || '201.184.49.203';
    this.port = parseInt(process.env.PROXMOX_PORT) || 8006;
    this.node = process.env.PROXMOX_NODE || 'servidor1';

    this.tokenUser = process.env.PROXMOX_USER || 'api-user@pve';
    this.tokenId = process.env.PROXMOX_TOKEN_ID || 'mi-token';
    this.tokenSecret = process.env.PROXMOX_TOKEN_SECRET;

    const rejectUnauthorized = process.env.PROXMOX_REJECT_UNAUTHORIZED !== 'false';

    this.client = axios.create({
      baseURL: `https://${this.host}:${this.port}/api2/json`,
      headers: {
        'Authorization': `PVEAPIToken=${this.tokenUser}!${this.tokenId}=${this.tokenSecret}`
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized,
        family: 4
      }),
      timeout: 120000
    });
  }

  async getNextVMID() {
    try {
      const response = await this.client.get('/cluster/nextid');
      return response.data.data;
    } catch (error) {
      console.error('❌ Error getNextVMID:', error.message);
      throw new Error('No se pudo obtener VMID: ' + error.message);
    }
  }

  async getAvailableTemplates() {
    try {
      console.log(`📡 Consultando storage 'local' en nodo '${this.node}'...`);
      const response = await this.client.get(`/nodes/${this.node}/storage/local/content`);

      if (!response.data || !response.data.data) return [];

      const templates = response.data.data
        .filter(item => item.content === 'vztmpl')
        .map(item => ({
          volid: item.volid,
          name: item.volid.split('/').pop()
        }));

      console.log(`✅ Templates encontrados: ${templates.length}`);
      return templates;
    } catch (error) {
      console.error('❌ Error getAvailableTemplates:', error.message);
      return [];
    }
  }

  async createContainer(config) {
    try {
      const isKvm = config.tipo === 'KVM';
      const endpoint = isKvm ? `/nodes/${this.node}/qemu` : `/nodes/${this.node}/lxc`;

      // Sanitizar hostname para cumplir con formato DNS
      const safeHostname = (config.hostname || 'vps').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      const params = {
        vmid: config.vmid,
        cores: config.cores,
        memory: config.memory,
        start: 1,
        onboot: 1
      };

      if (isKvm) {
        params.name = safeHostname;
        params.scsihw = 'virtio-scsi-pci';
        params.net0 = 'virtio,bridge=vmbr0';
        params.virtio0 = `local-lvm:${config.disk}`;

        let isoPath = config.template || 'Windows10.iso';
        if (!isoPath.includes(':')) isoPath = `local:iso/${isoPath}`;
        if (isoPath.includes(':iso/')) params.ide2 = `${isoPath},media=cdrom`;
        params.ostype = 'l26';
      } else {
        params.hostname = safeHostname;
        // Usa el password único generado por el caller, no uno hardcodeado
        params.password = config.password;
        params.rootfs = `local-lvm:${config.disk}`;
        params.net0 = 'name=eth0,bridge=vmbr0,ip=dhcp';

        let tmplPath = config.template || 'ubuntu-24.04-standard_24.04-2_amd64.tar.zst';
        if (!tmplPath.includes(':')) tmplPath = `local:vztmpl/${tmplPath}`;
        params.ostemplate = tmplPath;
        params.unprivileged = 1;
      }

      console.log(`🚀 Creando ${isKvm ? 'VM' : 'LXC'} en Proxmox con VMID ${params.vmid}`);
      const response = await this.client.post(endpoint, new URLSearchParams(params));
      return response.data;
    } catch (error) {
      console.error('❌ Error createContainer:', error.response?.data || error.message);
      throw new Error('Error creando instancia: ' + (JSON.stringify(error.response?.data?.errors) || error.message));
    }
  }

  async startInstance(vmid, type = 'lxc') {
    try {
      const response = await this.client.post(`/nodes/${this.node}/${type}/${vmid}/status/start`);
      return response.data;
    } catch (error) {
      console.error('Error startInstance:', error.message);
      throw error;
    }
  }

  async stopInstance(vmid, type = 'lxc') {
    try {
      const response = await this.client.post(`/nodes/${this.node}/${type}/${vmid}/status/stop`);
      return response.data;
    } catch (error) {
      console.error('Error stopInstance:', error.message);
      throw error;
    }
  }

  async rebootInstance(vmid, type = 'lxc') {
    try {
      const response = await this.client.post(`/nodes/${this.node}/${type}/${vmid}/status/reboot`);
      return response.data;
    } catch (error) {
      console.error('Error rebootInstance:', error.message);
      throw error;
    }
  }

  async getStatus(vmid, type = 'lxc') {
    try {
      const response = await this.client.get(`/nodes/${this.node}/${type}/${vmid}/status/current`);
      if (type === 'lxc' && response.data.data.status === 'running') {
        try {
          const net = await this.client.get(`/nodes/${this.node}/lxc/${vmid}/interfaces`);
          const netInterface = net.data.data.find(i => i.name !== 'lo' && i.inet && !i.inet.startsWith('127.'));
          if (netInterface && netInterface.inet) response.data.data.ip_publica = netInterface.inet.split('/')[0];
        } catch (e) { }
      }
      return response.data.data;
    } catch (error) {
      throw new Error(`Error getStatus: ${error.message}`);
    }
  }

  async getVNCProxy(vmid, type = 'lxc') {
    try {
      const endpoint = `/nodes/${this.node}/${type}/${vmid}/vncproxy`;
      console.log(`📡 Solicitando VNC Proxy a Proxmox: ${endpoint}`);

      const response = await this.client.post(endpoint, new URLSearchParams({
        websocket: 1
      }));

      return response.data.data;
    } catch (error) {
      const errorDetail = error.response?.data?.errors || error.response?.data || error.message;
      console.error('❌ Error detallado de Proxmox VNC:', JSON.stringify(errorDetail));
      throw new Error(`Error getVNCProxy: ${JSON.stringify(errorDetail)}`);
    }
  }

  async deleteInstance(vmid, type = 'lxc') {
    try {
      try {
        await this.stopInstance(vmid, type);
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (e) { }

      const response = await this.client.delete(`/nodes/${this.node}/${type}/${vmid}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return { success: true, message: 'Not found in Proxmox' };
      throw error;
    }
  }

  getConsoleURL(vmid, type = 'lxc') {
    return `https://proxmox.bigdata.net.co:8006/?console=${type}&vmid=${vmid}&node=${this.node}`;
  }
}

module.exports = new ProxmoxService();
