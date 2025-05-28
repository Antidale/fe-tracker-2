'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function entrySubmit(formData: FormData) {


  const flagsRaw = formData.get("flags");
  const flags = flagsRaw?.toString().replace(/[\n\r]+/g, '')
  const bgColor = formData.get("bg-color");
  const scrubbed = bgColor?.toString().replace("#", "%23")
  const portInfo = formData.get("port");

  revalidatePath('/tracker');
  redirect(`/tracker?flags=${flags}&bgColor=${scrubbed}&port=${portInfo}`);

}