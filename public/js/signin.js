const signInForm = document.querySelector('form')
const email = document.getElementById('email')
const pass1 = document.getElementById('psw1')
const pass2 = document.getElementById('psw2')

signInForm.addEventListener('submit', (e) => {

    e.preventDefault()

    if(pass1.value===pass2.value) {
        console.log("entro")
        console.log("value", pass1.value)
        fetch("/users/create", {
            method: 'POST',
            body: {
                email: email.value,
                password: pass1.value
            }
        }).then((response) => {
            return response.json()
        }).catch(e => {
            console.log("Error", e)
        })
    }else {
        alert("Las constraseñas no coinciden")
    }
})