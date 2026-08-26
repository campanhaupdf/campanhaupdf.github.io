# Campanhaupdf — Panfletagem UP — V3

Versão em amarelo, branco e preto, seguindo a identidade visual observada na página oficial de eleições da Unidade Popular.

Inclui:
- seção de candidaturas do DF;
- formulário sem o campo frequência;
- nome, WhatsApp, região, local, dias, horários e observações;
- Supabase preparado;
- painel administrativo preparado.

Candidaturas conferidas na página oficial em 26/08/2026:
- Professora Samara Mineiro — Governador(a), DF — 80
- Professor Guilherme Amorim — Senador(a), DF — 800
- Durval — Deputado(a) Federal, DF — 80.80
- Milena do MLB — Deputado(a) Federal, DF — 80.00
- BÁRBARA CALISTA — Deputado(a) Estadual, DF — 80.110
- CHRISTIAN RODRIGUES SENA — Deputado(a) Estadual, DF — 80.123

A página oficial lista as seis candidaturas do DF. As fotos oficiais são carregadas pelo próprio site de origem; nesta versão, apenas a foto de Samara foi incorporada como imagem externa encontrada publicamente. Os demais cards usam iniciais para não inventar ou alterar a aparência dos candidatos. Se você me enviar as seis fotos, eu as coloco localmente no ZIP.

Fonte: https://unidadepopular.org.br/eleicoes

## Configuração
1. Execute supabase.sql no Supabase.
2. Preencha config.js com URL e chave pública.
3. Não use service_role no frontend.
4. Proteja admin.html com autenticação antes de produção.
