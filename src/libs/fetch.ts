export async function fetchData<T>(url: string): Promise<T | undefined> {
    const response = await fetch(url);
    try {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json() as T;
        return data;
    } catch (error) {
        console.error("Failed to fetch data:", error);
    }
}

export async function postData<T>(url: string, data: T): Promise<void> {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error("Failed to post data:", error);
    }
}


