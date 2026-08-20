/**
 * Real client work, built with AI. Kept deliberately separate from the lab's
 * own products (DECISAO-017): this proves execution capability, not the lab's
 * "if it earns zero, I show it" thesis — the numbers here belong to the
 * clients, not to Leo Ferraz.
 *
 * Every entry links to a live, publicly reachable URL. For an evidence-led
 * brand a verifiable link outranks a screenshot: a capture is an assertion,
 * a URL is something the reader can check.
 *
 * `status` must state what a thing actually is. Pages that declare their own
 * state ("Brandbook preliminar", "Página demonstrativa") carry that state
 * here verbatim — `Built ≠ Validated` (VOICE_AND_LANGUAGE.md).
 */

export type ArtifactStatus = 'EM OPERAÇÃO' | 'PÚBLICO' | 'PRELIMINAR' | 'DEMONSTRAÇÃO';

export interface ClientArtifact {
  label: string;
  href: string;
  status: ArtifactStatus;
}

export interface ClientProject {
  id: string;
  client: string;
  scope: string;
  /**
   * Real capture of a real page — never a mockup or a decorative card. The
   * whole point is that the reader can open the link beside it and land on
   * the same thing they just saw.
   */
  thumbnail: string;
  thumbnailAlt: string;
  artifacts: ClientArtifact[];
}

export const clientWork: ClientProject[] = [
  {
    id: 'porto-alegre-oficial',
    client: 'Porto Alegre Oficial',
    scope: 'CRM · operação comercial',
    thumbnail: '/evidence/porto-alegre-oficial.webp',
    thumbnailAlt: 'Visão geral do CRM da Porto Alegre Oficial, com indicadores de aquisição e conversão',
    artifacts: [
      {
        label: 'CRM Porto Alegre Oficial',
        href: 'https://crm.oficialportoalegre.com.br/login',
        status: 'EM OPERAÇÃO',
      },
    ],
  },
  {
    id: 'vitra',
    client: 'Vitra',
    scope: 'Central operacional · sistema de marca',
    thumbnail: '/evidence/vitra.webp',
    thumbnailAlt: 'Capa do brandbook da Vitra Imobiliária',
    artifacts: [
      {
        label: 'Central Operacional',
        href: 'https://vitrapremium.com.br',
        status: 'EM OPERAÇÃO',
      },
      {
        label: 'Brandbook Vitra Imobiliária',
        href: 'https://vitrapremium.com.br/brandbook/imobiliaria/',
        status: 'PÚBLICO',
      },
      {
        label: 'Brandbook Vitra Premium',
        href: 'https://vitrapremium.com.br/brandbook/premium/',
        status: 'PÚBLICO',
      },
    ],
  },
  {
    id: 'uliz-arzana',
    client: 'Uli Zarzana',
    scope: 'CRM · direção visual · página de captação',
    thumbnail: '/evidence/uliz-arzana.webp',
    thumbnailAlt: 'Regras de uso do sistema visual de Uli Zarzana',
    artifacts: [
      {
        label: 'CRM Uli Zarzana',
        href: 'https://crm.ulizarzana.com/login',
        status: 'EM OPERAÇÃO',
      },
      {
        label: 'Direção visual',
        href: 'https://ulizarzana.com/identidade-visual/',
        status: 'PRELIMINAR',
      },
      {
        label: 'Brandbook',
        href: 'https://ulizarzana.com/brandbook/',
        status: 'PRELIMINAR',
      },
      {
        label: 'Página de captação',
        href: 'https://ulizarzana.com',
        status: 'DEMONSTRAÇÃO',
      },
    ],
  },
];
