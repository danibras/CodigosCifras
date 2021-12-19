"use strict";

var cifra_codigo_clicked = '';
var key_state = true;

$(document).ready(function() {
    autocomplete(document.getElementById("myInput"), cifras_codigos);
    $("#originalText").keyup(function() {
        var original = $("#originalText").val();
        translate(cifra_codigo_clicked, original);
    });
    $("#key").keyup(function() {
        var original = $("#originalText").val();
        translate(cifra_codigo_clicked, original);
    });
});


//AUTOCOMPLETE 
function autocomplete(inp, cifras) {
    
    inp.addEventListener("input", function() {

        $(".autocompleteItem").parent().remove()

        var val = this.value

        if (!val) { 
            $("#myInput").css("border-bottom-left-radius", "10px")
            return false; 
        }

        var sugestionsList = document.createElement("DIV");
        sugestionsList.setAttribute("id", this.id + "autocompleteList");
        sugestionsList.setAttribute("class", "autocompleteList");
        this.parentNode.appendChild(sugestionsList);

        cifras.forEach(element => {
            $("#myInput").css("border-bottom-left-radius", "0px")
            if (element.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                var item = document.createElement("DIV");
                item.setAttribute("class", "autocompleteItem");
                item.innerHTML = "<strong>" + element.substr(0, val.length) + "</strong>";
                item.innerHTML += element.substr(val.length);
                item.innerHTML += "<input type='hidden' value='" + element + "'>";
                sugestionsList.appendChild(item);
            }
        });

        if ($(".autocompleteList").children().length == 0){
            $("#myInput").css("border-bottom-left-radius", "10px")
        }

        $(".autocompleteItem").click(function(){
            $("[name='mySearch']").val(this.getElementsByTagName("input")[0].value)
            cifra_codigo_clicked = this.getElementsByTagName("input")[0].value;
            translate(cifra_codigo_clicked, $("#originalText").val());
            $(".autocompleteItem").parent().remove()
            $("#myInput").css("border-bottom-left-radius", "10px")
        });

        $(".autocompleteItem").hover(
            function() {
                let cifra = this.getElementsByTagName("input")[0].value;
                let original = $("#originalText").val();
                $("#key").prop("disabled", key_state);
                $("#key").val("");
                translate(cifra, original);
            },
            function() {
                $("#key").prop("disabled", key_state);
                $("#key").val("");
                translate(cifra_codigo_clicked, $("#originalText").val());
            }
        );
    })
}

/*An array containing all the translations:*/
var cifras_codigos = ["Data", "Alfabeto Invertido", "Alfabeto Transposto",
    "Passa um Melro", "Passam dois Melros", "Alfabeto Numeral", "Alfabeto Numeral com Chave",
    "Romano-Árabe", "Metades", "Vogais por Pontos", "Caranguejo",
    "Chave +3", "Código Chinês 1", "Angular 1", "Angular 2", "Última Letra Falsa",
    "Primeira Letra Falsa", "Código Morse", "Morse"
];




/**---------------TRANSLATER ZONE---------------**/

var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
var alphabetReversed =  ['z', 'y', 'x', 'w', 'v', 'u', 't', 's', 'r', 'q', 'p', 'o', 'n', 'm', 'l', 'k', 'j', 'i', 'h', 'g', 'f', 'e', 'd', 'c', 'b', 'a']
var romanArabeAlphabet = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];
var numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
var morse = ['.-', '-...', '-.-.', '-..', '.', '..-.', '--.', '....', '..', '.--.', '-.-', '.-..', '--', '-.', '---', '.--.', '--.-', '.-.', '...', '-', '..-', '...-', '.--', '-..-', '-.--', '--..'];
var morseNumbers = ['-----', '.----', '..---', '...--', '....-', '.....', '-....', '--...', '---..', '----.'];
var roman = { 'a': 'I', 'e': 'II', 'i': 'III', 'o': 'IV', 'u': 'V' };
var vowels = ['a','e','i','o','u'];
var alphabetGrid = [
    ['j', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'],
    ['t', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', ],
    ['3', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2'],
    ['', '4', '5', '6', '7', '8', '9']
];


function translate(cifra, original) {
    let origi = original.split('');
    let key = $("#key").val();


    const tradutor = {
        CodigoMorse(origi, key) {
            let translated = '';
            for (let i = 0; i < origi.length; i++) { //Percorre a lista de letras original
                if (alphabet.includes(origi[i].toLowerCase())) { //Transforma letras
                    translated += exchangeList(alphabet, morse, origi[i].toLowerCase());
                } else if (numbers.includes(origi[i])) { //Transforma numeros
                    translated += exchangeList(numbers, morseNumbers, origi[i].toLowerCase());
                } else { //Coloca outro tipo de caracteres no traslated
                    translated += origi[i]
                }
                translated += ' ';
            }
            return ['text', translated]
        },
        Data(origi, key) {
            let translated = '';
            $("#key").prop("disabled", false); //Ativa o input da key
            if (key.length == 4 && isInt(key)) {
                for (let i = 0; i < origi.length; i++) { //Percorre a lista de letras original
                    let insideGrid = false; //Cotrola se a letra ja foi encontrada
                    for (let j = 0; j < alphabetGrid.length; j++) { //Percorre as rows da grid
                        if (alphabetGrid[j].indexOf(origi[i].toLowerCase()) != -1) { //Se a letra estiver na row
                            translated += key[j] + alphabetGrid[j].indexOf(origi[i].toLowerCase());
                            insideGrid = true;
                        }
                    }
                    if (insideGrid == false) { //Se for um caracter nao pertencente ah grid
                        translated += origi[i];
                    }
                }
                return ['text', translated];
            } else {
                return ['text', 'Introduza, na chave, uma data com 4 dígitos'];
            }
        },
        AlfabetoInvertido(origi, key) {
            let translated = '';
            for (let i = 0; i < origi.length; i++) { //Percorre a lista de letras original
                if (alphabet.includes(origi[i].toLowerCase())) {
                    translated += alphabetReversed[alphabet.indexOf(origi[i])];
                } else { //Coloca outro tipo de caracteres no traslated
                    translated += origi[i];
                }
            }
            return ['text', translated]; //Inverte a lista
        },
        AlfabetoTransposto(origi, key) {
            let translated = '';
            $("#key").prop("disabled", false); //Ativa o input da key
            if (key.length == 1 && !isInt(key)) {
                for (let i = 0; i < origi.length; i++) { //Percorre a lista de letras original
                    if (alphabet.includes(origi[i].toLowerCase())) { //Transforma as letras
                        translated += alphabetTranspost(key, origi[i].toLowerCase());
                    } else { //Coloca outro tipo de caracteres no traslated
                        translated += origi[i];
                    }
                }
                return ['text', translated];
            } else {
                return ['text', 'Introduza uma letra na chave'];
            }
        },
        PassaumMelro(origi, key) {
            let translated = '';
            for (let i = 0; i < origi.length; i++) { //Percorre a lista de letras original
                if (alphabet.includes(origi[i].toLowerCase())) {
                    translated += origi[i] + alphabet[Math.floor(Math.random() * alphabet.length)];
                } else { //Coloca outro tipo de caracteres no traslated
                    translated += origi[i];
                }
            }
            return ['text', translated]
        },
        PassamdoisMelros(origi, key) {
            let translated = '';
            for (let i = 0; i < origi.length; i++) { //Percorre a lista de letras original 
                if (alphabet.includes(origi[i].toLowerCase())) {
                    translated += origi[i] + alphabet[Math.floor(Math.random() * alphabet.length)] + alphabet[Math.floor(Math.random() * alphabet.length)];
                } else { //Coloca outro tipo de caracteres no traslated
                    translated += origi[i];
                }
            }
            return ['text', translated]
        },
        AlfabetoNumeral(origi, key) {
            let translated = '';
            for (let i = 0; i < origi.length; i++) { //Percorre a lista de letras original 
                let number = alphabet.indexOf(origi[i].toLowerCase()) + 1; //Converte a letra para numero
                if (number != 0) {
                    if (number.toString().length == 1) {
                        translated += '0';
                    }
                    translated += number;
                } else { //Coloca outro tipo de caracteres no traslated
                    translated += origi[i];
                }
            }
            return ['text', translated]
        },
        AlfabetoNumeralcomChave(origi, key) {
            let translated = '';
            $("#key").prop("disabled", false); //Ativa o input da key
            if (isInt(key)) {
                key = Number(key);
                for (let i = 0; i < origi.length; i++) { //Percorre a lista de letras original 
                    let number = alphabet.indexOf(origi[i].toLowerCase()) + key; //Converte a letra para numero
                    if (number != -1 + key) {
                        if (number.toString().length == 1) {
                            translated += '0';
                        }
                        translated += number;
                    } else { //Coloca outro tipo de caracteres no traslated
                        translated += origi[i];
                    }
                }
            } else {
                return ['text', 'Introduza um número na chave'];
            }
            return ['text', translated]
        },
        RomanoArabe(origi, key) {
            let translated = '';
            for (let i = 0; i < origi.length; i++) { //Percorre a lista de letras original 
                let number = romanArabeAlphabet.indexOf(origi[i].toLowerCase()) + 1;
                if (number != 0) { //Converte a letra para numero
                    translated += number;
                } else if (Object.keys(roman).indexOf(origi[i].toLowerCase()) != -1) { //Converte a letra para numero romano
                    translated += roman[origi[i].toLowerCase()];
                } else { //Coloca outro tipo de caracteres no traslated
                    translated += origi[i];
                }
            }
            return ['text', translated]
        },
        Metades(origi, key) {
            let translated = '';
            let metade1 = '';
            let metade2 = '';
            let origiNoSpaces = '';
            for (let i = 0; i < origi.length; i++) { //Percorre a lista de letras original 
                if (alphabet.includes(origi[i].toLowerCase())) {
                    if (metade1.length == metade2.length) {
                        metade1 += origi[i];
                    } else {
                        metade2 += origi[i];
                    }
                }
            }
            return ['text', metade1 + metade2]
        },
        VogaisporPontos(origi, key){
            let translated = [];
            for (let i = 0; i < origi.length; i++) {
                if (vowels.includes(origi[i].toLowerCase())){ //Verifica se a letra eh uma vogal
                    translated += '.';
                }
                else{
                    translated += origi[i];
                }
            };
            return ['text', translated]
        },
        Caranguejo(origi, key) {
            return ['text', original.split('').reverse().join('')]; //Inverte a lista
        },
        Chave3(origi, key){
            return ['text', tradutor['AlfabetoTransposto'](origi, 'd')[1]]; //Utiliza o alfabeto transposto a comecar na letra D
        },
        CodigoChines1(origi, key){
            let translated = [];
            for (let i = 0; i < origi.length; i++) {
                if (alphabet.includes(origi[i])) {
                    translated.push(`<img src="./codigo_chines1/${origi[i]}.svg" class="codedImage" >`)
                }
                else{
                    translated.push(`<img src="./codigo_chines1/blank.svg" class="codedImage" >`)
                }
            }
            return['image', translated]
        },
        Angular1(origi, key){
            let translated = [];
            for (let i = 0; i < origi.length; i++) {
                if (alphabet.includes(origi[i])) {
                    translated.push(`<img src="./angular1/${origi[i]}.svg" class="codedImage" >`)
                }
                else{
                    translated.push(`<img src="./angular1/blank.svg" class="codedImage" >`)
                }
            }
            return['image', translated]
        },
        Angular2(origi, key){
            let translated = [];
            for (let i = 0; i < origi.length; i++) {
                if (alphabet.includes(origi[i])) {
                    translated.push(`<img src="./angular2/${origi[i]}.svg" class="codedImage" >`)
                }
                else{
                    translated.push(`<img src="./angular2/blank.svg" class="codedImage" >`)
                }
            }
            return['image', translated]
        },
        UltimaLetraFalsa(origi, key){
            console.log(origi);
            let translated = '';
            for (let i = 0; i < origi.length; i++) { //Percorre a lista de letras original
                if (origi[i] == ' ') {
                    translated += alphabet[Math.floor(Math.random() * alphabet.length)] + ' '; //Adiciona uma letra random antes de cada espaco
                } else { //Coloca outro tipo de caracteres no traslated
                    translated += origi[i];
                }
            }
            translated += alphabet[Math.floor(Math.random() * alphabet.length)] //Adiciona uma letra random ah ultima palavra
            return ['text', translated]
        },
    }

    let translated;
    //Remove espacos, acentos e sinais
    const tradutorFunction = tradutor[cifra.replace(/\s+|-/gi, '')
        .replace(/á/gi, 'A')
        .replace(/ó/gi, 'o')
        .replace(/ê/gi, 'e')
        .replace(/ú/gi, 'U')
        .replace('+', '')
        ];

    if (tradutorFunction) {
        translated = tradutorFunction(origi, key);
        if (translated[0] == 'text'){
            $("#codedText").show();
            $("#codedImagesDiv").hide();
            $("#codedText").val(translated[1]) //Display no translated se a cifra for texto
        }
        if (translated[0] == 'image'){
            $("#codedText").hide();
            $("#codedImagesDiv").show();
            $('#imagesSpan').html('');
            for (let i= 0; i < translated[1].length; i++) {
                $('#imagesSpan').append(translated[1][i]);
            }
        }
    }

        /*
        switch (cifra) {
            case 'Morse': DONE
                break;
            case 'Código Braille (Falso)':
                // code block
                break;
            case 'Data': DONE
                // code block
                break;
            case 'Alfabeto Invertido': DONE
                // code block
                break;
            case 'Alfabeto Transposto': DONE
                // code block
                break;
            case 'Picos de Morse':
                // code block
                break;
            case 'Passa um Melro': DONE
                // code block
                break;
            case 'Passam dois Melros': DONE
                // code block
                break;
            case 'Alfabeto Numeral': DONE
                // code block
                break;
            case 'Alfabeto Numeral com Chave': DONE
                // code block
                break;
            case 'Romano-Árabe': DONE
                // code block
                break;
            case 'Metades': DONE
                // code block
                break;
            case 'Grelha':
                // code block
                break;
            case 'Vogais por Pontos': DONE
                // code block
                break;
            case 'Caranguejo': DONE
                // code block
                break;
            case 'Frase 1':
                // code block
                break;
            case 'Frase 2':
                // code block
                break;
            case 'Chave +3': DONE
                // code block
                break;
            case 'Código Chinês 1': DONE
                // code block
                break;
            case 'Código Chinês 2': DONE
                // code block
                break;
            case 'Angular 1': DONE
                // code block
                break;
            case 'Angular 2': DONE
                // code block
                break;
            case 'Última Letra Falsa': DONE
                // code block
                break;
            case 'Homógrafo-Traços':
                // code block
                break;
            case 'Nós de Morse':
                // code block
                break;
            case 'Batalha Naval com chave':
                // code block
                break;
            case 'Batalha Naval':
                // code block
                break;
            default:
                $("#codedText").val("");
        }
        */
}

function alphabetTranspost(key, letter) {
    key = alphabet.indexOf(key);
    if ((alphabet.indexOf(letter) + key) < 26) {
        return alphabet[alphabet.indexOf(letter) + key];
    } else {
        return alphabet[(alphabet.indexOf(letter) + key) - 26];
    }
}

function exchangeList(list1, list2, letter) {
    return list2[list1.indexOf(letter)];
}

function isInt(value) {
    return !isNaN(value) &&
        parseInt(Number(value)) == value &&
        !isNaN(parseInt(value, 10));
}