import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { loginUser } from "@/lib/api";
import BackButton from "@/components/back-button";

export default function LoginPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });


    const handleLogin = async () => {
        try {
            const data = await loginUser(formData.username, formData.password);

            // JWT 토큰만 저장 (role과 username은 자동으로 디코딩됨)
            useAuthStore.getState().setToken(data.accessToken);

            // 리액트 쿼리 캐시 초기화 - 이전 계정의 데이터 제거
            queryClient.clear();

            // 장바구니 초기화 - 이전 계정의 장바구니 제거
            useCartStore.getState().clearCart();

            alert("로그인 성공!");
            navigate("/stores");
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : "로그인에 실패했습니다.";
            alert(errorMsg);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log("Login attempt:", formData);

        handleLogin();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    };

    return (
        <div className="min-h-screen bg-secondary/30 flex items-center justify-center">
            <div className="w-full max-w-md">


                <Card>
                    <CardHeader className="space-y-1">
                        <div className="flex items-center gap-2">
                            <BackButton />
                            <CardTitle className="text-2xl font-bold">로그인</CardTitle>
                        </div>
                        <CardDescription>닉네임과 비밀번호를 입력하세요</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">닉네임</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">비밀번호</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                로그인
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                        <div className="text-sm text-muted-foreground text-center">
                            계정이 없으신가요?{" "}
                            <Link to="/register" className="text-primary hover:underline">
                                회원가입
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}