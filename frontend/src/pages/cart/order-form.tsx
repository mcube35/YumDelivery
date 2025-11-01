import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OrderFormProps {
    deliveryAddress: string;
    specialRequests: string;
    onDeliveryAddressChange: (value: string) => void;
    onSpecialRequestsChange: (value: string) => void;
}

const FormField = ({
    id,
    label,
    value,
    onChange,
    placeholder,
    required = false
}: {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    required?: boolean;
}) => (
    <div className="space-y-2">
        <Label htmlFor={id}>{label} {required && '*'}</Label>
        <Input
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
        />
    </div>
);

export function OrderForm({
    deliveryAddress,
    specialRequests,
    onDeliveryAddressChange,
    onSpecialRequestsChange
}: OrderFormProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>배송 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormField
                    id="address"
                    label="배송 주소"
                    value={deliveryAddress}
                    onChange={onDeliveryAddressChange}
                    placeholder="배송받을 주소를 입력해주세요"
                    required
                />

                <FormField
                    id="requests"
                    label="요청사항"
                    value={specialRequests}
                    onChange={onSpecialRequestsChange}
                    placeholder="특별한 요청사항이 있으시면 입력해주세요"
                />
            </CardContent>
        </Card>
    );
}