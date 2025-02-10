"use server";

export async function getData(formData: FormData) {
  console.log(formData.get("code"));
}
