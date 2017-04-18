document.getElementById("fakeInputBtn").addEventListener('click', () => {

	function modifyDOM() {
		let string = ` Я помню чудное мгновенье:
		Передо мной явилась ты,
			Как мимолетное виденье,
				Как гений чистой красоты.

		В томленьях грусти безнадежной
		В тревогах шумной суеты,
			Звучал мне долго голос нежный
		И снились милые черты.

		Шли годы.Бурь порыв мятежный
		Рассеял прежние мечты,
			И я забыл твой голос нежный,
				Твои небесные черты.

		В глуши, во мраке заточенья
		Тянулись тихо дни мои
		Без божества, без вдохновенья,
			Без слез, без жизни, без любви.

		Душе настало пробужденье:
		И вот опять явилась ты,
			Как мимолетное виденье,
				Как гений чистой красоты.

		И сердце бьется в упоенье,
			И для него воскресли вновь
		И божество, и вдохновенье,
			И жизнь, и слезы, и любовь. `;

		let index = 0;
		let element = document.body.getElementsByClassName("im_editable im-chat-input--text _im_text")[0];
		element.addEventListener("keydown", (listener) => {

			event.preventDefault();

			if (listener.code === "Backspace") {
				element.textContent = element.textContent.slice(0, -1);

				if (index > 0) {
					index--;
				}
				else {
					index = 0;
				}
			}
			else {
				element.textContent += string[index];
				if (index === string.length - 1) {
					index = 0;
				}
				else {
					index++;
				}
			}

			(function (cursorManager) {

				//From: http://www.w3.org/TR/html-markup/syntax.html#syntax-elements
				var voidNodeTags = ['AREA', 'BASE', 'BR', 'COL', 'EMBED', 'HR', 'IMG', 'INPUT', 'KEYGEN', 'LINK', 'MENUITEM', 'META', 'PARAM', 'SOURCE', 'TRACK', 'WBR', 'BASEFONT', 'BGSOUND', 'FRAME', 'ISINDEX'];

				//From: http://stackoverflow.com/questions/237104/array-containsobj-in-javascript
				Array.prototype.contains = function (obj) {
					var i = this.length;
					while (i--) {
						if (this[i] === obj) {
							return true;
						}
					}
					return false;
				}
				//Basic idea from: http://stackoverflow.com/questions/19790442/test-if-an-element-can-contain-text
				function canContainText(node) {
					if (node.nodeType == 1) { //is an element node
						return !voidNodeTags.contains(node.nodeName);
					} else { //is not an element node
						return false;
					}
				};

				function getLastChildElement(el) {
					var lc = el.lastChild;
					while (lc && lc.nodeType != 1) {
						if (lc.previousSibling)
							lc = lc.previousSibling;
						else
							break;
					}
					return lc;
				}

				//Based on Nico Burns's answer
				cursorManager.setEndOfContenteditable = function (contentEditableElement) {

					while (getLastChildElement(contentEditableElement) &&
						canContainText(getLastChildElement(contentEditableElement))) {
						contentEditableElement = getLastChildElement(contentEditableElement);
					}

					var range, selection;
					if (document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
					{
						range = document.createRange();//Create a range (a range is a like the selection but invisible)
						range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
						range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
						selection = window.getSelection();//get the selection object (allows you to change selection)
						selection.removeAllRanges();//remove any selections already made
						selection.addRange(range);//make the range you have just created the visible selection
					}
					else if (document.selection)//IE 8 and lower
					{
						range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
						range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
						range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
						range.select();//Select the range (make it the visible selection
					}
				}

			}(window.cursorManager = window.cursorManager || {}));

			cursorManager.setEndOfContenteditable(element);
		}, false);

		return document.body.innerHTML;
	}

	chrome.tabs.executeScript({
		code: '(' + modifyDOM + ')();'
	}, (results) => { });
});

document.getElementById("randomFillBtn").addEventListener('click', () => {

	function modifyDOM() {

		let randomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
		let textArr = [
			"Привет, как дела?",
			"Что нового?",
			"Чмоки всем в этом чате",
			"Случайный текст",
			"Еще текст"
		];
		let randomIndex = randomInRange(0, textArr.length - 1);

		let element = document.body.getElementsByClassName("im_editable im-chat-input--text _im_text")[0];

		element.click();
		element.textContent = textArr[randomIndex];
		return document.body.innerHTML;
	}

	chrome.tabs.executeScript({
		code: '(' + modifyDOM + ')();'
	}, (results) => { });
});

