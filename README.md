# 🌤️ Weatherly — Weather Dashboard

<p align="center">
  <strong>Dashboard meteorológico moderno, responsivo e interativo.</strong>
</p>

<p align="center">
  Aplicação web desenvolvida com HTML, CSS e JavaScript, utilizando a API Open-Meteo para consultar informações meteorológicas em tempo real.
</p>

<p align="center">
  <a href="https://jonaskenpachi3-design.github.io/weather-dashboard/">
    <strong>🌐 Ver projeto online</strong>
  </a>
</p>

---

## 📌 Sobre o projeto

O **Weatherly** é um dashboard de previsão do tempo desenvolvido como projeto de portfólio para praticar conceitos fundamentais e intermediários de desenvolvimento web.

A aplicação permite pesquisar diferentes cidades e visualizar informações meteorológicas atuais, além de uma previsão para os próximos dias.

O projeto também possui recursos como cidades favoritas, modo claro/escuro, gráfico de temperatura, tratamento de erros e armazenamento de preferências no navegador.

O principal objetivo foi criar uma aplicação que combinasse:

- Uma interface moderna
- Boa experiência de usuário
- Consumo de API externa
- JavaScript assíncrono
- Manipulação do DOM
- Responsividade
- Persistência de dados no navegador
- Organização de código

---

## 🌐 Demonstração

### 🚀 Projeto online

**[Acessar o Weatherly](https://jonaskenpachi3-design.github.io/weather-dashboard/)**

### 📦 Repositório

**[GitHub — Weather Dashboard](https://github.com/jonaskenpachi3-design/weather-dashboard)**

---

## ✨ Funcionalidades

### 🔎 Pesquisa de cidades

O usuário pode pesquisar uma cidade e obter seus dados meteorológicos.

A aplicação utiliza uma API de geocodificação para transformar o nome da cidade em coordenadas geográficas.

---

### 🌡️ Clima atual

São exibidas informações como:

- Temperatura atual
- Sensação térmica
- Umidade relativa do ar
- Velocidade do vento
- Condição climática
- Data e horário local

---

### 📅 Previsão para os próximos dias

O Weatherly apresenta uma previsão meteorológica de **5 dias**, mostrando:

- Condição climática
- Temperatura máxima
- Temperatura mínima
- Ícone representativo

---

### 📊 Gráfico de temperatura

A aplicação utiliza **Chart.js** para apresentar visualmente a variação das temperaturas previstas.

Isso facilita a interpretação dos dados meteorológicos de forma rápida.

---

### ⭐ Cidades favoritas

É possível adicionar uma cidade aos favoritos.

As cidades favoritas ficam armazenadas no navegador através do:

```javascript
localStorage
