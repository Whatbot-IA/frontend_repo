# 🌤️ Configuração da API de Clima

O dashboard do Zapbot utiliza a API OpenWeatherMap para exibir dados meteorológicos em tempo real.

## 📝 Passo a Passo para Configurar

### 1. Obter Chave da API (Gratuita)

1. Acesse: https://openweathermap.org/api
2. Clique em "Sign Up" (Cadastrar)
3. Crie uma conta gratuita
4. Após confirmar o email, acesse "API keys"
5. Copie sua chave API (ex: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

### 2. Configurar o Projeto

1. Na raiz do projeto, copie o arquivo `.env.example`:
   ```bash
   copy .env.example .env
   ```

2. Abra o arquivo `.env` e cole sua chave:
   ```env
   VITE_OPENWEATHER_API_KEY=sua_chave_api_real_aqui
   VITE_WEATHER_CITY=Luanda
   VITE_WEATHER_COUNTRY=AO
   ```

3. Reinicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## 🌍 Personalizar Localização

Para mudar a cidade, edite no arquivo `.env`:
```env
VITE_WEATHER_CITY=Lisboa
VITE_WEATHER_COUNTRY=PT
```

## 📊 Dados Exibidos

O card de clima mostra:
- ✅ Temperatura atual
- ✅ Temperaturas máxima e mínima
- ✅ Descrição do clima (ensolarado, nublado, etc.)
- ✅ Humidade do ar
- ✅ Velocidade do vento
- ✅ Qualidade do ar (AQI)
- ✅ Previsão para os próximos 4 dias
- ✅ Hora e data atualizadas em tempo real

## ⚡ Modo Fallback

Se a API não estiver configurada ou houver erro, o sistema exibe automaticamente dados de exemplo para que o dashboard continue funcionando.

## 🔄 Atualização Automática

Os dados são atualizados automaticamente a cada **10 minutos** enquanto o dashboard estiver aberto.

## 💡 Plano Gratuito OpenWeatherMap

- ✅ 1.000 chamadas por dia
- ✅ Dados atuais e previsão
- ✅ Sem necessidade de cartão de crédito
- ✅ Ativação instantânea da chave API

---

**Nota de Segurança**: Nunca compartilhe sua chave API publicamente ou faça commit do arquivo `.env` no Git!
