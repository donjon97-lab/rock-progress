const params = new URLSearchParams(window.location.search);
const encoded = params.get("data");

if (!encoded) {
  document.body.innerHTML = "<h2>No data provided</h2>";
  throw new Error("No data");
}

// decode payload
const payload = JSON.parse(atob(encoded));
const username = payload.u;
const bytes = Uint8Array.from(atob(payload.i), c => c.charCodeAt(0));

document.getElementById("title").innerText =
  `${username}'s Rock Collection`;

// helper cek kepemilikan
function hasRock(index) {
  const byte = bytes[Math.floor(index / 8)];
  return (byte & (1 << (7 - (index % 8)))) !== 0;
}

fetch("rocks.json")
  .then(res => res.json())
  .then(rocks => {
    const grid = document.getElementById("rockGrid");
    let ownedCount = 0;

    rocks.forEach((rock, index) => {
      const owned = hasRock(index);
      if (owned) ownedCount++;

      const card = document.createElement("div");
      card.className = `rock-card ${owned ? "owned" : "missing"}`;

      card.innerHTML = `
        <img src="${rock.imgUrl}">
        <div>${rock.rockName}</div>
      `;

      grid.appendChild(card);
    });

    // progress bar
    const percent = Math.floor((ownedCount / rocks.length) * 100);
    document.getElementById("progressFill").style.width = percent + "%";
    document.getElementById("progressText").innerText =
      `${ownedCount}/${rocks.length} Rocks Collected (${percent}%)`;
  });
