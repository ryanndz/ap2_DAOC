// nomes dos status: completo pro modal e abreviado pro card
export const nomesStatus = {
  hp: 'HP',
  attack: 'Ataque',
  defense: 'Defesa',
  'special-attack': 'Atq. Especial',
  'special-defense': 'Def. Especial',
  speed: 'Velocidade',
}

export const nomesCurtos = {
  hp: 'HP',
  attack: 'ATQ',
  defense: 'DEF',
  'special-attack': 'ATQ ESP',
  'special-defense': 'DEF ESP',
  speed: 'VEL',
}

// cor da barrinha conforme o valor do status
export function corDoStatus(valor) {
  if (valor >= 100) return 'bg-green-500'
  if (valor >= 60) return 'bg-yellow-400'
  return 'bg-red-400'
}

// 150 como maximo só pra barra ficar proporcional (quase nenhum passa disso)
export function larguraDoStatus(valor) {
  return Math.min(valor / 150, 1) * 100 + '%'
}
