var csrftoken = '{{ csrf_token }}'
function getCookie(name) {
	let cookieValue = null;
	if (document.cookie && document.cookie !== '') {
		const cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].trim();
			// Checks if this cookie string starts with the name we want
			if (cookie.substring(0, name.length + 1) === (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}

let buffer;

async function backendPost(path, ...data)
{
	let _data = [];
	let dataIndex = 0;
	let response;
	for (const arg of data)
	{
		_data[dataIndex] = arg;
		dataIndex++;
	}
	try {
		const csrfToken = getCookie('csrftoken');
		response = await fetch(path, {
			method: "POST",
			body: JSON.stringify(_data),
			headers: {
				'X-CSRFToken': csrfToken,
				"Content-type": "application/json; charset=UTF-8"
			}
		});

		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}

		buffer = await response.json();
	} catch (error) {
		console.error(error.message);
		buffer = {error: error.message};
	}
}

async function postAvatar(fileInput)
{
	const formData = new FormData();
	let response;

	formData.append('avatar_img', fileInput.files[0]);
	try {
		const csrfToken = getCookie('csrftoken');
		response = await fetch("/post/avatar/", {
			method: "POST",
			body: formData,
			headers: {
				'X-CSRFToken': csrfToken
			}
		});

		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}

		buffer = await response.json();
	} catch (error) {
		console.error(error.message);
		buffer = {error: error.message};
	}
}

async function getAvatar()
{
	try {
		const csrfToken = getCookie('csrftoken');
		const response = await fetch("/get/avatar/", {
			method: "POST",
			body: "",
			headers: {
				'X-CSRFToken': csrfToken
			}
		});

		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}
		buffer = await response.json();
	} catch (error) {
		console.error(error.message);
		buffer = {error: error.message};
	}
}
