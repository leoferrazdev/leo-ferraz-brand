export type GameInDevelopment = {
  name: string;
  status: string;
  description: string;
  image: string;
  imageAlt: string;
  platformUrl?: string;
};

export const gamesInDevelopment: GameInDevelopment[] = [
  {
    name: 'Sproutbound — Salto ao Sol',
    status: 'Em desenvolvimento · Em revisão de distribuição',
    description: 'Pip salta entre folhas, coleta gotas de sol e tenta alcançar o topo sem tocar nos espinhos.',
    image: '/evidence/sproutbound-1280x720.jpg',
    imageAlt: 'Pip saltando entre folhas iluminadas em Sproutbound.',
  },
];
