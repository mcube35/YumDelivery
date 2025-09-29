### 1️⃣ 핵심 테이블 및 속성

| 테이블 | 주요 컬럼 | 설명 |
|--------|-----------|------|
| **User** | `id (PK)`<br>`username (UQ)`<br>`email (UQ)`<br>`password`<br>`role` (enum: `USER`/`OWNER`)<br>`created_at` | 주문자·사장님 공통 관리 |
| **Store** | `id (PK)`<br>`owner_id (FK→User.id)`<br>`name`<br>`address`<br>`created_at` | 사장님이 운영하는 매장 |
| **Menu** | `id (PK)`<br>`store_id (FK→Store.id)`<br>`name`<br>`price`<br>`stock` | 매장별 메뉴 |
| **Order** | `id (PK)`<br>`user_id (FK→User.id)`<br>`store_id (FK→Store.id)`<br>`status` (enum: `PENDING/ACCEPTED/REJECTED/COMPLETED`)<br>`total_price`<br>`created_at` | 사용자 1명의 주문 |
| **OrderItem** | `id (PK)`<br>`order_id (FK→Order.id)`<br>`menu_id (FK→Menu.id)`<br>`qty`<br>`price` | 주문별 메뉴 상세 |

### 2️⃣ 관계(ERD)

- **User – Store**: **1:N** (사장님 1명 → 여러 Store, 일반 사용자 Store 없음)
- **Store – Menu**: **1:N** (매장 1개 → 여러 Menu)
- **User – Order**: **1:N** (사용자 1명 → 여러 주문)
- **Store – Order**: **1:N** (주문 → 특정 Store)
- **Order – OrderItem – Menu**: **1:N + N:1** (OrderItem: 주문-메뉴 연결, 단가·수량 포함)