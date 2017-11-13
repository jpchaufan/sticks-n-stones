var app = app || {};

(function(){



//////// ANIMSLS ////////
// each world fragment will get assigned an animal type, and has a chance of spawning animals of that type each day

app.animalTypes = [
	{
		type: 'deer',
		population: 2,
		chance: 0.6
	},
	{
		type: 'rodent',
		population: 10,
		chance: 0.8
	}
];


//////// BIOMES /////////
app.biomes = {
	rocky: {
		name: 'rocky',
		chance: 0.245,
		tileType: 'dirt',
		stoneChance: 0.015
	},
	meadow: {
		name: 'meadow',
		chance: 0.245,
		tileType: 'grass',
		stoneChance: 0.0002,
		herbChance: 0.0005
	},
	fruitTrees: {
		name: 'fruit trees',
		chance: 0.245,
		tileType: 'grass',
		fruitTreeChance: 0.015
	},
	pines: {
		name: 'pines',
		chance: 0.245,
		tileType: 'dirt',
		stoneChance: 0.002,
		pineTreeChance: 0.015
	},
	water: { 
		name: 'water',
		chance: 0.02,
		tileType: 'water'
	}
}

/////// ITEMS /////////
app.items = {
	stone: {
		name: "Stone",
		img: "imgs/stone.png",
		maxHold: 25,
		maxStash: 150,
		throwable: true,
		throwImgName: 'stone',
		throwSpeed: 1,
		throwW: 32,
		throwH: 32
	},
	stick: {
		name: "Stick",
		img: "imgs/stick.png",
		maxHold: 25,
		maxStash: 150,
		throwable: true,
		throwImgName: 'stick',
		throwSpeed: 1,
		throwW: 70,
		throwH: 89
	},
	leaf: {
		name: "Leaf",
		img: "imgs/leaf2.png",
		edible: 1,
		maxHold: 25,
		maxStash: 15
	},
	tomato: {
		name: "Tomato",
		img: "imgs/tomato.png",
		edible: 3,
		maxHold: 10,
		maxStash: 15
	},
	potato: {
		name: "Potato",
		img: "imgs/potato.png",
		edible: 7,
		maxHold: 9,
		maxStash: 150
	},
	carrot: {
		name: "Carrot",
		img: "imgs/carrots.png",
		edible: 4,
		maxHold: 10,
		maxStash: 150
	},
	artichoke: {
		name: "Artichoke",
		img: "imgs/artichoke.png",
		edible: 7,
		maxHold: 2,
		maxStash: 5
	},
	pepper: {
		name: "Pepper",
		img: "imgs/peppers.png",
		edible: 2,
		maxHold: 10,
		maxStash: 15
	},
	eggplant: {
		name: "Eggplant",
		img: "imgs/eggplant.png",
		edible: 4,
		maxHold: 12,
		maxStash: 15
	},
	corn: {
		name: "Corn",
		img: "imgs/corn.png",
		edible: 4,
		maxHold: 12,
		maxStash: 25
	},
	pear: {
		name: "Pear",
		img: "imgs/pear.png",
		edible: 3,
		maxHold: 7,
		maxStash: 25
	},
	mushroom: {
		name: "Mushroom",
		img: "imgs/mushroom.png",
		edible: 3,
		maxHold: 7,
		maxStash: 25
	},
	rawMeat: {
		name: "Raw Meat",
		img: "imgs/item_meat.png",
		maxHold: 15,
		maxStash: 25
	}
};


})();