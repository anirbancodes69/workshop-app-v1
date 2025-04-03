document.addEventListener("DOMContentLoaded", () => {
  const itemForm = document.getElementById("itemForm");
  const itemsList = document.getElementById("itemsList");

  // Load items when page loads
  fetchItems();

  // Form submission
  itemForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newItem = {
      name: document.getElementById("itemName").value,
      price: parseFloat(document.getElementById("itemPrice").value),
    };

    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) throw new Error("Failed to add item");

      itemForm.reset();
      fetchItems();
    } catch (err) {
      alert(err.message);
    }
  });

  // Fetch and display items
  async function fetchItems() {
    try {
      const response = await fetch("/api/items");
      const items = await response.json();

      itemsList.innerHTML = items
        .map(
          (item) => `
                <tr>
                    <td>${item.name}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>${new Date(item.createdAt).toLocaleDateString()}</td>
                </tr>
            `
        )
        .join("");
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  }
});
