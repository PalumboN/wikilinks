// ==UserScript==
// @name           WikiLinks
// @description    El juego de Wikipedia
// @author         @PalumboN
// @include        https://*wikipedia.org/wiki*
// @version        1.0
// ==/UserScript==

game = {}

function htmlTitle() {
	return $('#firstHeading')[0]
}

function loadGame() {
	game.current = htmlTitle().textContent
	game.origin = localStorage.getItem('origin')
	game.objective = localStorage.getItem('objective')
	game.points = Number.parseInt(localStorage.getItem('points') || "0")
	game.pause = localStorage.getItem('pause') || 'false'
	game.results = JSON.parse(localStorage.getItem('results') || "[]")
}

function minimalize() {
	$('.portal').remove()
	$('#footer').remove()
	$('#mw-head').remove()
}


function isForGame(link) {
	return link != null && !link.startsWith('#')
}

function addPoint() {
	savePoints(game.points + 1)
}

function watchLinks() {
	$('a')
	.filter((_, it) => isForGame(it.getAttribute('href')))
	.click(addPoint)
}

function newGame() {
	saveOrigin(game.current)
	saveObjective($('#objective')[0].value)
	savePoints(0)
	location.reload()
}

function pause() {
	savePause(true)
	location.reload()
}

function addMenu() {
	template = `
	<div align="center">
		<h3>WikiLinks</h3>
		<span id="new_game">Nuevo juego: </span>
		<input type="text" id="objective" placeholder="Llegar hasta..."></input>
	</div>
	`
	newGameLink = $('<a href="#"> Comenzar</a>')
	newGameLink.click(newGame)

	pauseLink = $('<br><a href="#">Pausar juego</a>')
	pauseLink.click(pause)

	$(template).append(newGameLink).append(pauseLink).insertBefore(htmlTitle())
}

function unpause() {
	savePause(false)
	location.reload()
}

function addUnpause() {
	unpauseLink = $(`
	<div align="center">
		<h3>WikiLinks</h3>
		<a href="#">¡Podés jugar a WikiLinks!</a>
	</div>
	`)
	unpauseLink.click(unpause)
	unpauseLink.insertBefore(htmlTitle())
}

function updateTitle() {
	htmlTitle().textContent = game.current + " -> " + game.objective + " | links: " + game.points
}

function win() {
	return game.current == game.objective && game.points > 0
}

function saveResult() {
	name = $("#player_name")[0].value
	jumps = game.points
	path = game.origin + " -> " + game.objective
	game.results.push({name, path, jumps})
	saveResults(game.results)
}

function endGame() {
	template = `
	<div align="center">
		<h4>¡GANASTE!</h4>
		<span>Lograste ir </span>
		<input type="text" value="desde ${game.origin} a ${game.objective}" disabled></input>
		<span> en </span>
		<input type="text" value="${game.points}" disabled></input>
		<span> saltos. Un nuevo record! </span>
		<br>
		<input type="text" id="player_name" placeholder="Nombre"></input>
	</div>
	`
	newGameLink = $('<a href="#">Guardar</a> <hr>')
	newGameLink.click(saveResult)

	$(template).append(newGameLink).insertBefore($("#new_game"))
}

function savePoints(p) {
	localStorage.setItem('points', p)
}

function saveOrigin(o) {
	localStorage.setItem('origin', o)
}

function saveObjective(o) {
	localStorage.setItem('objective', o)
}

function savePause(p) {
	localStorage.setItem('pause', p)
}

function saveResults(r) {
	localStorage.setItem('results', JSON.stringify(r))
}

function init() {
	loadGame()
	if (game.pause == "true")
		return addUnpause()
	minimalize()
	watchLinks()
	addMenu()
	updateTitle()
	console.log("¡Hola, estás jugando a WikiLinks!")

	if (win()) endGame()
}

init()
