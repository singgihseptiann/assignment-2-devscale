import { fetchData, postData } from "./libs/fetch";
import { Ipost } from "./types/entity";

// Mendefinisikan interface untuk hasil data posting
interface IpostResult {
    data: Ipost[];
}

const apiUrl = "https://v1.appbackend.io/v1/rows/tAKetX7PsmlD";

// Fungsi untuk mengambil data
async function getData() {
    try {
        const result = await fetchData<IpostResult>(apiUrl);

        if (!result || !result.data) {
            console.log("Data tidak ditemukan atau terjadi kesalahan");
            return;
        }

        const postsSection = document.getElementById("posts");
        if (postsSection) {
            postsSection.innerHTML = ''; // Hapus posting yang ada

            result.data.forEach((post) => {
                const card = document.createElement("div");
                card.className = "card";

                const title = document.createElement("h2");
                title.textContent = post.title;

                const contentWrapper = document.createElement("div");
                contentWrapper.className = "content-wrapper";

                const content = document.createElement("p");
                content.className = "content";
                content.textContent = post.content;

                const moreText = document.createElement("p");
                moreText.className = "more";
                moreText.textContent = post.content;

                const btnText = document.createElement("button");
                btnText.className = "read-more-btn";
                btnText.textContent = "Baca Selengkapnya";
                btnText.onclick = () => toggleReadMore(card, content, moreText, btnText);

                contentWrapper.append(content, moreText);
                card.append(title, contentWrapper, btnText);

                const author = document.createElement("p");
                author.className = "author";
                author.textContent = `Author: ${post.penulis}`;

                const deleteButton = document.createElement("button");
                deleteButton.className = "delete-btn";
                deleteButton.innerHTML = `<i class="fas fa-trash-alt"></i>`; // Ikon hapus
                deleteButton.onclick = () => handleDeleteClick(post._id);

                card.append(author, deleteButton);
                postsSection.appendChild(card);
            });
        } else {
            console.log("Bagian posting tidak ditemukan");
        }
    } catch (error) {
        console.error("Gagal mengambil data:", error);
    }
}

// Fungsi untuk menambahkan posting baru
async function addPost(title: string, content: string, penulis: string) {
    try {
        const newPost = [{ title, content, penulis }];
        await postData(apiUrl, newPost);
        await getData(); // Perbarui data
        clearForm(); // Kosongkan form
    } catch (error) {
        console.error("Gagal menambahkan posting:", error);
    }
}

// Fungsi untuk menghapus posting
async function deletePost(ids: string[]) {
    try {
        await fetch(apiUrl, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ids)
        });
        await getData(); // Perbarui data setelah dihapus
    } catch (error) {
        console.error("Gagal menghapus posting:", error);
    }
}

// Fungsi untuk menangani klik tombol hapus
async function handleDeleteClick(id: string) {
    const confirmed = confirm("Apakah Anda yakin ingin menghapus posting ini?");
    if (confirmed) {
        await deletePost([id]);
    }
}

// Fungsi untuk menangani pembacaan lebih lanjut
function toggleReadMore(card: HTMLElement, content: HTMLElement, moreText: HTMLElement, btnText: HTMLElement) {
    if (card.classList.contains("expanded")) {
        card.classList.remove("expanded");
        content.style.display = "block";
        moreText.style.display = "none";
        btnText.textContent = "Baca Selengkapnya";
    } else {
        card.classList.add("expanded");
        content.style.display = "none";
        moreText.style.display = "block";
        btnText.textContent = "Baca dikit";
    }
}

// Fungsi untuk mengosongkan field form
function clearForm() {
    (document.getElementById("title") as HTMLInputElement).value = '';
    (document.getElementById("content") as HTMLTextAreaElement).value = '';
    (document.getElementById("penulis") as HTMLInputElement).value = '';
}

// Event listener untuk pengiriman form
document.getElementById("post-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = (document.getElementById("title") as HTMLInputElement).value;
    const content = (document.getElementById("content") as HTMLTextAreaElement).value;
    const penulis = (document.getElementById("penulis") as HTMLInputElement).value;

    if (title && content && penulis) {
        await addPost(title, content, penulis);
    } else {
        console.log("Semua field harus diisi");
    }
});

// Memuat posting yang ada saat halaman dimuat
getData();
