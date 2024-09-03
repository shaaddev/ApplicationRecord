"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

export const loginAction = async (formData: FormData) => {
  const supabase = createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/");
  return {
    success: true,
    redirect: '/application-record'
  }
};

export const signupAction = async (formData: FormData) => {
  const supabase = createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/");
  return {
    success: true,
    redirect: '/login'
  }
};

export const signOutAction = async () => {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect("/error");
  }

  revalidatePath("/");
  redirect("/");
};

export const signInWithGitHubAction = async () => {
  const supabase = createClient();
  const origin = headers().get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return redirect("/error");
  } else {
    return redirect(data.url);
  }
};

export const signInWithGoogleAction = async () => {
  const supabase = createClient();
  const origin = headers().get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    return redirect("/error");
  } else {
    return redirect(data.url);
  }
};

export const signInWithTwitterAction = async () => {
  const supabase = createClient();
  const origin = headers().get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "twitter",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error){
    return redirect("/error")
  } else {
    return redirect(data.url)
  }
}

export const signInWithLinkedinAction = async () => {
  const supabase = createClient();
  const origin = headers().get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "linkedin_oidc",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error){
    return redirect("/error")
  } else {
    return redirect(data.url)
  }
}

export const signInAnonymouslyAction = async () => {
  const supabase = createClient();
  
  const { error } = await supabase.auth.signInAnonymously();

  if (error) {
    redirect("/error");
  } else {
    revalidatePath("/");
    redirect("/application-record");
  }
};
