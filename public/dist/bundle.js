/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./public/js/app.js":
/*!**************************!*\
  !*** ./public/js/app.js ***!
  \**************************/
/***/ (() => {

eval("var lat = document.querySelector('#lat').value || -16.495858688006876;\nvar lng = document.querySelector('#lng').value || -68.13393650971288;\nvar map = L.map('mapa').setView([lat, lng], 18);\nvar edit = document.querySelector('#editar').value || 'crear';\n\nif (edit === 'editar') {\n  marker = new L.marker([lat, lng], {\n    draggable: true,\n    autoPan: true\n  }).addTo(map).bindPopup('Me Perdí por Aquí').openPopup();\n  marker.on('moveend', function (e) {\n    marker = e.target;\n    var posicion = marker.getLatLng();\n    lat = posicion.lat;\n    lng = posicion.lng;\n    map.panTo(new L.LatLng(lat, lng));\n    llenarInputs(lat, lng);\n  });\n}\n\nif (edit === 'crear') {\n  map.locate({\n    enableHighAccuracy: true\n  });\n  map.on('locationfound', function (e) {\n    lat = e.latlng.lat;\n    lng = e.latlng.lng;\n    llenarInputs(lat, lng);\n    var coordenadas = [lat, lng];\n    marker = new L.marker(coordenadas, {\n      draggable: true,\n      autoPan: true\n    }).addTo(map).bindPopup('Me Perdí por Aquí').openPopup();\n    map.panTo(new L.LatLng(lat, lng));\n    marker.on('moveend', function (e) {\n      marker = e.target;\n      var posicion = marker.getLatLng();\n      lat = posicion.lat;\n      lng = posicion.lng;\n      map.panTo(new L.LatLng(lat, lng));\n      llenarInputs(lat, lng);\n    });\n  });\n  map.on('locationerror', function (e) {\n    marker = new L.marker([lat, lng], {\n      draggable: true,\n      autoPan: true\n    }).addTo(map).bindPopup('Me Perdí po Aquí').openPopup();\n    map.panTo(new L.LatLng(lat, lng));\n    llenarInputs(lat, lng);\n    marker.on('moveend', function (e) {\n      marker = e.target;\n      var posicion = marker.getLatLng();\n      lat = posicion.lat;\n      lng = posicion.lng;\n      map.panTo(new L.LatLng(lat, lng));\n      llenarInputs(lat, lng);\n    });\n  });\n}\n\ndocument.addEventListener('DOMContentLoaded', function () {\n  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\n    attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\n  }).addTo(map);\n});\n\nfunction llenarInputs(lat, lng) {\n  document.querySelector('#lat').value = lat || '';\n  document.querySelector('#lng').value = lng || '';\n}\n\n//# sourceURL=webpack://meeti/./public/js/app.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./public/js/app.js"]();
/******/ 	
/******/ })()
;