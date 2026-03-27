---
name: Entorno Ollama - Servidor IA
alwaysApply: true
description: Configuración del servidor de IA, modelos disponibles y preferencias de uso.
---

# 🤖 Entorno de IA - BigCloud

## Servidor Ollama
- **URL:** http://10.15.15.10:11434
- **CPU:** 40 hilos
- **RAM:** 80+ GB
- **GPU:** RTX 3060 12GB VRAM

## Modelos Disponibles
| Modelo | Uso |
|--------|-----|
| qwen2.5-coder:14b | Principal (chat, edit, apply) |
| deepseek-coder-v2:16b | Alternativa (código complejo) |
| 
omic-embed-text:latest | Embeddings |

## Preferencias
- **Modelo principal:** Qwen 2.5 Coder 14B para la mayoría de tareas
- **Modelo alternativo:** DeepSeek Coder 16B para código complejo o razonamiento profundo
- **Respuestas:** Siempre en español (es-CO)
- **Comandos:** Incluir comandos de terminal cuando sean relevantes

## Reglas Adicionales
- Priorizar el uso del servidor remoto (GPU) sobre ejecución local.
- Si un modelo no responde correctamente, sugerir cambiar al alternativo.
- Para tareas de embeddings, usar 
omic-embed-text:latest.
