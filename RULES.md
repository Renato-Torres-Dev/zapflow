# Regras de Desenvolvimento - IA

## 📋 Leitura Obrigatória
**ANTES DE QUALQUER ALTERAÇÃO**, este arquivo deve ser lido completamente.

## 🎯 Diretrizes Principais

### Componentes
- **Priorize componentes reutilizáveis** em `src/components/ui`
- Crie componentes atômicos e combináveis
- Use `class-variance-authority` para variações de componentes
- Utilize `cn()` utility function de `src/lib/utils.ts` para classes condicionais

### Estilização
- **NUNCA use CSS inline** (style={{}})
- Use apenas classes Tailwind CSS
- Utilize variáveis CSS definidas em `globals.css`
- Mantenha consistência com o design system

### Estrutura de Pastas
```
src/
├── components/
│   └── ui/          # Componentes atômicos reutilizáveis
├── lib/             # Utilitários (utils.ts, etc.)
└── app/             # Páginas e layouts
```

### Design System
- **Dark Mode**: Background (#09090B), Primary (#00F2FE - Neon), Card (#101013), Border (#27272A)
- Use cores semânticas definidas no tailwind.config.ts
- Mantenha consistência visual em toda aplicação

### Código
- TypeScript obrigatório
- Use import aliases (`@/components`, `@/lib`)
- Componentes funcionais com React hooks
- Props tipadas corretamente

### Performance
- Lazy loading para componentes pesados
- Otimização de imagens com Next.js Image
- Code splitting por rota

## ⚠️ Regras Estritas
1. **Leia este arquivo antes de codificar**
2. **Sem CSS inline** - use Tailwind classes
3. **Componentes reutilizáveis** - evite duplicação
4. **Use `cn()`** para classes dinâmicas
5. **Mantenha o design system** - não invente cores

## 🔄 Workflow
1. Ler RULES.md
2. Verificar se componente existe em `src/components/ui`
3. Se não existir, criar componente reutilizável
4. Usar utilitários existentes
5. Testar em dark mode

**Desrespeitar estas regras resultará em código não padronizado e difícil de manter.**
