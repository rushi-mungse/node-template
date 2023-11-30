const headerLinks = document.querySelectorAll("#headerLinks a");
headerLinks.forEach((link) => link.classList.remove("activeHeaderLink"));
headerLinks[0].classList.add("activeHeaderLink");
