document.getElementById("btn").addEventListener('click', () => {

	function modifyDOM() {
		let html = document.body.innerHTML;
		let matches = html.match(/<(input|textarea) .*?>/g);
		for (let match of matches) {
			if (!~match.indexOf('type="hidden"')) {
				console.log(match);
				let insert = (str, index, value) => str.substr(0, index) + value + str.substr(index);
				let newValue = insert(match, match.length - 1, 'value="ADADADAD"')
				html.replace(match, newValue);
			}
		}
		document.body.innerHTML = html;
		return document.body.innerHTML;
	}

	chrome.tabs.executeScript({
		code: '(' + modifyDOM + ')();'
	}, (results) => { });
});
