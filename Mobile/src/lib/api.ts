import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://ip da sua maquina:3333',
})
