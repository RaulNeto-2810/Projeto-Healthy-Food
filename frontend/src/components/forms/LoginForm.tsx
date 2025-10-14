import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/auth/login/",
                {
                    email: formData.email,
                    password: formData.password,
                }
            );

            const { access_token } = response.data;
            localStorage.setItem("authToken", access_token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

            navigate("/dashboard-cliente");
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                console.error("Erro no login:", err.response?.data);
            } else {
                console.error("Erro no login:", err);
            }
            setError("Email ou senha inválidos. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="px-8 px-[1.01em] py-[1.01em]">
                    <CardTitle>Login Cliente</CardTitle>
                    <CardDescription>
                        Digite seu e-mail abaixo para acessar sua conta.
                    </CardDescription>
                </CardHeader>

                <CardContent className="px-8">
                    <form onSubmit={handleSubmit}>
                        <FieldGroup className="gap-8">
                            {/* Email */}
                            <Field className="gap-3">
                                <div className="px-[1.01em]">
                                    <FieldLabel htmlFor="email">Email</FieldLabel>
                                </div>
                                <div className="px-[1.01em]">
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="seuemail@example.com"
                                        required
                                        className="py-[1.01em] px-4"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </Field>

                            {/* Senha */}
                            <Field className="gap-3">
                                <div className="flex items-center px-[1.01em]">
                                    <FieldLabel htmlFor="password">Senha</FieldLabel>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Esqueceu sua senha?
                                    </a>
                                </div>
                                <div className="px-[1.01em]">
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        className="py-[1.01em] px-3"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </Field>

                            {/* Erro de login */}
                            {error && (
                                <div className="px-[1.01em]">
                                    <p className="text-sm text-red-500 text-center">{error}</p>
                                </div>
                            )}

                            {/* Botões */}
                            <Field className="gap-4">
                                <div className="px-[1.01em]">
                                    <Button
                                        type="submit"
                                        className="w-full py-[1.01em]"
                                        disabled={loading}
                                    >
                                        {loading ? "Entrando..." : "Login"}
                                    </Button>
                                </div>

                                <div className="px-[1.01em] py-[1.01em]">
                                    <FieldDescription className="text-center">
                                        Não tem uma conta?{" "}
                                        <Link
                                            to="/register"
                                            className="underline font-semibold text-gray-600"
                                        >
                                            Cadastre-se
                                        </Link>
                                    </FieldDescription>
                                </div>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
