import { useState, useEffect } from 'react';

// funciona igual o useState, mas salva o valor no localStorage
// usei pros favoritos nao sumirem quando recarrega a pagina
export default function useLocalStorage(chave, valorInicial) {
  const [valor, setValor] = useState(() => {
    try {
      const salvo = localStorage.getItem(chave);
      return salvo !== null ? JSON.parse(salvo) : valorInicial;
    } catch {
      return valorInicial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(chave, JSON.stringify(valor));
    } catch {
      // aba anonima ou storage cheio, so ignora
    }
  }, [chave, valor]);

  return [valor, setValor];
}
