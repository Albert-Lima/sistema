var buttonHeader = document.querySelectorAll(".button_nav_header")

function PainelAdmin(){
    buttonHeader[0].classList.add("selected_nav_header")
    buttonHeader[1].classList.remove("selected_nav_header")
    buttonHeader[2].classList.remove("selected_nav_header")
}

function PainelUsers(){
    buttonHeader[1].classList.add("selected_nav_header")
    buttonHeader[0].classList.remove("selected_nav_header")
    buttonHeader[2].classList.remove("selected_nav_header")
}