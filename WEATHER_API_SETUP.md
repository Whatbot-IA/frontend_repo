# 🌤️ Configuração da API de Clima

O dashboard do Zapbot utiliza a **WeatherAPI.com** para exibir dados meteorológicos em tempo real.

## 📝 Passo a Passo para Configurar

### 1. Obter Chave da API (Gratuita)

1. Acesse: https://www.weatherapi.com/signup.aspx
2. Preencha o formulário de cadastro
3. Confirme seu email
4. Acesse o dashboard e copie sua **API Key**
5. A chave estará visível em: https://www.weatherapi.com/my/

### 2. Configurar o Projeto

1. Na raiz do projeto, copie o arquivo `.env.example`:
   ```bash
   copy .env.example .env
   ```

2. Abra o arquivo `.env` e cole sua chave:
   ```env
   VITE_WEATHER_API_KEY=sua_chave_api_real_aqui
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

Ou use apenas o nome da cidade:
```env
VITE_WEATHER_CITY=São Paulo
```

## 📊 Dados Exibidos

O card de clima mostra:
- ✅ Temperatura atual
- ✅ Temperaturas máxima e mínima do dia
- ✅ Descrição do clima em português (ensolarado, nublado, etc.)
- ✅ Humidade do ar (%)
- ✅ Velocidade do vento (km/h)
- ✅ Qualidade do ar (US EPA Index)
- ✅ Previsão para os próximos 4 dias com emojis
- ✅ Hora e data atualizadas em tempo real
- ✅ Localização completa (cidade, país)

## ⚡ Modo Fallback

Se a API não estiver configurada ou houver erro, o sistema:
- 🔔 Exibe banner amarelo discreto no topo
- 📊 Mostra dados de exemplo para manter o layout
- ⏰ Mantém hora e data reais atualizadas

## 🔄 Atualização Automática

Os dados são atualizados automaticamente a cada **10 minutos** enquanto o dashboard estiver aberto.

## 💡 Plano Gratuito WeatherAPI

- ✅ **1 milhão de chamadas por mês** (muito mais que OpenWeatherMap!)
- ✅ Dados atuais e previsão de 3 dias
- ✅ Qualidade do ar incluída
- ✅ Dados em português (lang=pt)
- ✅ Sem necessidade de cartão de crédito
- ✅ Ativação instantânea da chave API

## 🆚 Vantagens sobre OpenWeatherMap

1. **Mais chamadas gratuitas**: 1M/mês vs 1000/dia
2. **Dados mais simples**: Uma única requisição para tudo
3. **Melhor suporte a idiomas**: Português incluído nativamente
4. **JSON mais limpo**: Estrutura mais fácil de trabalhar
5. **Air Quality incluso**: Não precisa de chamada separada

## 🔗 Links Úteis

- **Documentação**: https://www.weatherapi.com/docs/
- **Dashboard**: https://www.weatherapi.com/my/
- **Signup**: https://www.weatherapi.com/signup.aspx
- **API Explorer**: https://www.weatherapi.com/api-explorer.aspx

---

**Nota de Segurança**: Nunca compartilhe sua chave API publicamente ou faça commit do arquivo `.env` no Git!
