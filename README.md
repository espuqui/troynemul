# Troy N'emül'

Troy N'emül' es un catálogo de particulas del idioma mapuche para aprenderla a través de ejemplos.

## Version Web
https://www.troynemul.org/

## Ejecutar
### Prerequisitos
* Instalar [NodeJS](https://nodejs.org/en/download/)

### Versión Electron
`npm run start`

## Contribuir
### Agregar nuevas particulas
Si eres chillkatufe, kimelfe, hablante nativo o encontraste un error, quieres agregar más ejemplos o mas entradas, estas se encuentran en el archivo [particles.json](https://github.com/espuqui/troynemul/blob/main/app/data/particles.json").
Por favor no copiar ejemplos de libros ya que estos pueden estar sujetos a copyright.

#### Formato

Las entradas estan en formato JSON, donde cada una es:

* particula: Nombre de la particula, por ejemplo, "mew"
* title: Titulo principal
* tipo: Tipo de particula
* color: Color de subrayado, con los nombres css
* fix (opcional): pre (prefijo),post(postfijo),in(infijo). Si no se agrega entonces es palabra suelta, como mew.
* explanation: Explicación principal
* variations: otras formas, por ejemplo "mu"
* content: Contenido principal. Para explicaciones largas se pueden proveer varias entradas.
  * explanation (opcional): explicación secundaria
  * examples: Ejemplos, pueden ser varios. Cada ejemplo es un array de 3 elementos, donde. 0 y 1 deben tener la misma cantidad de partes. Cada parte se separa por un guión.
    * 0: Frase en mapudungun.
    * 1: Frase en español. Debe tener los mismos elementos que 0. Las particulas se ponen con paréntesis y su entrada va a ser "nemul|tipo". Los sustantivos van así nomas.
    * 2: Traducción interpretada en español. Sin reglas.

```json
  "particula|tipo": {
    "title": "Titulo",
    "color": "red",
    "fix": "post",
    "explanation": "Una explicacion",
    "variations": [ ],
    "content": [
      {
        "explanation": "explicacion de la sección",
        "examples": [
          [
            "nemul1-nemul2-nemul3 nemul4 nemul5",
            "palabra1-palabra2-(tipo1) (tipo2) palabra5",
            "Significado interpretado en wingkadungun"
          ]
        ]
      }
    ]
  }
```



### Enviar feedback
No dudes en mandar ideas de que mas se podría agregar a la aplicación, no dudes en mandar feedback [aquí](https://github.com/espuqui/troynemul/issues").

#### Ideas de feedback
1. ¿Qué le falta a la aplicación para mejorar su uso?
2. ¿Están las letras muy chicas? muy grandes? o mejor configurarlas?1. Mostrar resultados en distintos grafemarios (azumchefe, unificado, . Hacer ejercicios, tipo completa la particula.

