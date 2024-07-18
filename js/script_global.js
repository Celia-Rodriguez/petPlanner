const btnMenu = $(".btnMainMenu");
const navBar = $(".navLinks");

btnMenu.on("click", function(){
    navBar.toggleClass("navLinks--visible");
});

$(".iconoInfo").tooltip({
    tooltipClass: "tooltip"
});

function proximamente(){
    Swal.fire({
        icon: "warning",
        title: "En contrucción",
        text: "Proximamente"
    })
}