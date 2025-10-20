// frontend/src/pages/LoginPage.tsx

import logoImg from "@/assets/logos/logo-dark.svg"; // Usando o alias '@' que configuramos
import { ProducerRegisterForm } from "@/components/forms/ProducerRegisterForm";

export function ProducerRegisterPage() {
    return (
        // A cor de fundo e o alinhamento são controlados pelo Tailwind CSS
        <div className="flex min-h-screen w-full flex-col items-center justify-center gap-10 bg-[#F0F2F0] p-4">
            <img src={logoImg} alt="Healthy Food Logo" className="h-12" />
            <div className="w-full max-w-sm">
                <ProducerRegisterForm />
            </div>
            <p className="text-center text-xs text-gray-500">
                © Healthy Food Tecnologia em Alimentos LTDA
            </p>
        </div>
    );
}
