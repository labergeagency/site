import { Recipe } from '../types';

export const RECIPES: Recipe[] = [
  { id: 'itlog-kamatis', name: 'Itlog na may kamatis at sibuyas', meals: ['almusal'], ingredients: ['itlog|egg', 'kamatis|tomato', 'sibuyas|onion'], carb: 'low' },
  { id: 'omelette-gulay', name: 'Omelette na may malunggay/gulay', meals: ['almusal'], ingredients: ['itlog|egg', 'malunggay|spinach|pechay|gulay'], carb: 'low' },
  { id: 'tokwa-sibuyas', name: "Tokwa't sibuyas (kaunting toyo, walang asukal)", meals: ['almusal', 'hapunan'], ingredients: ['tokwa|tofu', 'sibuyas|onion'], carb: 'low' },
  { id: 'oatmeal', name: 'Oatmeal (walang asukal) na may itlog', meals: ['almusal'], ingredients: ['oats|oatmeal', 'itlog|egg'], carb: 'medium', tip: 'Huwag lagyan ng asukal o condensed milk.' },
  { id: 'tuyo-kamatis', name: 'Tuyo/daing, kamatis at 1/2 tasang kanin', meals: ['almusal'], ingredients: ['tuyo|daing', 'kamatis|tomato', 'kanin|brown rice|bigas'], carb: 'medium' },
  { id: 'tinola', name: 'Tinolang manok na may sayote/papaya', meals: ['tanghalian', 'hapunan'], ingredients: ['manok|chicken', 'sayote|papaya|upo', 'malunggay|dahon ng sili|spinach'], carb: 'low' },
  { id: 'sinigang-isda', name: 'Sinigang na isda sa sampalok', meals: ['tanghalian', 'hapunan'], ingredients: ['isda|bangus|tilapia|galunggong', 'kangkong|labanos|gulay', 'sampalok|sinigang', 'kamatis|tomato'], carb: 'low' },
  { id: 'inihaw-bangus', name: 'Inihaw na bangus/tilapia na may kamatis', meals: ['tanghalian', 'hapunan'], ingredients: ['bangus|tilapia|isda', 'kamatis|tomato', 'sibuyas|onion'], carb: 'low' },
  { id: 'monggo', name: 'Ginisang monggo na may ampalaya/dahon', meals: ['tanghalian', 'hapunan'], ingredients: ['monggo|mongo', 'ampalaya|malunggay|spinach|dahon', 'bawang|garlic'], carb: 'medium' },
  { id: 'adobo-manok', name: 'Adobong manok (konting toyo, walang asukal)', meals: ['tanghalian', 'hapunan'], ingredients: ['manok|chicken', 'toyo|soy', 'suka|vinegar', 'bawang|garlic'], carb: 'low' },
  { id: 'upo-hipon', name: 'Ginisang upo na may hipon', meals: ['tanghalian', 'hapunan'], ingredients: ['upo', 'hipon|shrimp'], carb: 'low' },
  { id: 'pinakbet', name: 'Pinakbet', meals: ['tanghalian', 'hapunan'], ingredients: ['kalabasa', 'talong|eggplant', 'okra', 'sitaw', 'ampalaya'], carb: 'medium' },
  { id: 'tilapia-ensalada', name: 'Pritong tilapia + ensaladang kamatis', meals: ['tanghalian', 'hapunan'], ingredients: ['tilapia|isda', 'kamatis|tomato', 'sibuyas|onion'], carb: 'low', tip: 'Mas mabuti ang inihaw o steam kaysa prito.' },
  { id: 'chopsuey', name: 'Chopsuey (manok o hipon)', meals: ['tanghalian', 'hapunan'], ingredients: ['repolyo|carrots|karot|cauliflower|gulay', 'manok|hipon|chicken|shrimp'], carb: 'low' },
  { id: 'nilagang-baka', name: 'Nilagang baka na may repolyo at pechay', meals: ['tanghalian', 'hapunan'], ingredients: ['baka|beef', 'repolyo|cabbage', 'pechay'], carb: 'low' },
  { id: 'ampalaya-itlog', name: 'Ginisang ampalaya na may itlog', meals: ['almusal', 'tanghalian', 'hapunan'], ingredients: ['ampalaya', 'itlog|egg'], carb: 'low' },
  { id: 'tokwa-gulay-bowl', name: 'Tokwa at gulay na may brown rice', meals: ['tanghalian', 'hapunan'], ingredients: ['tokwa|tofu', 'gulay|pechay|repolyo|sitaw', 'brown rice|kanin'], carb: 'medium' },
];

export const CARB_SIDES = ['brown rice', 'kanin', 'bigas', 'kamote', 'oats'];
