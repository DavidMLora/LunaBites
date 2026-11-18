export interface BotanicalPlant {
  id: string;
  number: string;
  name: string;
  scientific: string;
  paragraphs: readonly string[];
}

/** Shared copy for the home preview and botanical page. Keep existing image paths and anchors. */
export const plants: readonly BotanicalPlant[] = [
  {
    id: 'valeriana',
    number: '01',
    name: 'Valeriana',
    scientific: 'Valeriana officinalis',
    paragraphs: [
      'Originaria de Europa y Asia, la valeriana es una planta herbácea que destaca por sus pequeñas flores y sus raíces aromáticas. Su raíz se ha utilizado tradicionalmente en preparaciones relacionadas con la relajación y el descanso.',
      'En Luna Bites, la valeriana forma parte de nuestra selección de ingredientes botánicos inspirados en la tranquilidad de la noche.',
    ],
  },
  {
    id: 'melisa',
    number: '02',
    name: 'Toronjil morado',
    scientific: 'Agastache mexicana',
    paragraphs: [
      'Originario de México, el toronjil morado es una planta aromática de la familia de las mentas. Se distingue por sus hojas aromáticas y sus flores de tonos violetas. Forma parte de la herbolaria tradicional mexicana y ha despertado interés por sus compuestos naturales y sus propiedades estudiadas en investigaciones botánicas.',
      'Su origen mexicano y su carácter aromático hacen de esta planta una parte especial de nuestra combinación vegetal.',
    ],
  },
  {
    id: 'pasiflora',
    number: '03',
    name: 'Pasiflora',
    scientific: 'Passiflora edulis',
    paragraphs: [
      'La pasiflora es una planta trepadora originaria de América tropical, conocida por sus flores llamativas y su fruto de la pasión. Sus hojas, tallos y frutos contienen diversos compuestos vegetales, entre ellos flavonoides, que han sido estudiados por sus propiedades biológicas.',
      'En Luna Bites, la pasiflora complementa nuestra selección de plantas y aporta otra historia fascinante del mundo vegetal.',
    ],
  },
];
