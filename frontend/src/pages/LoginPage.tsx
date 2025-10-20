// frontend/src/pages/LoginPage.tsx

import { LoginForm } from "@/components/forms/LoginForm";
import logoImg from "@/assets/logos/logo-dark.svg"; 

export function LoginPage() {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center gap-10 bg-[#F0F2F0] p-4">
            <img src={logoImg} alt="Healthy Food Logo" className="h-12" />
            <div className="w-full max-w-sm">
                <LoginForm />
            </div>
            <p className="text-center text-xs text-gray-500">
                © Healthy Food Tecnologia em Alimentos LTDA
            </p>
        </div>
    );
}
