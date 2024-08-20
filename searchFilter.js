<script>
function filterItems() {
    let input = document.getElementById("search").value;
    input = input.toLowerCase();
    let list = document.getElementById("itemList").getElementsByTagName("li");
    for (let i = 0; i < list.length; i++) {
        let item = list[i];
        if (item.innerHTML.toLowerCase().includes(input)) {
            item.style.display = "";
        } else {
            item.style.display = "none";
        }
    }
}
</script>