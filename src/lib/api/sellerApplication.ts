// API заявки на подключение продавца.
// Публичного эндпоинта на бэке пока нет — работаем на моках в любом режиме.
// Заявки хранятся в localStorage (демо). Когда бэк добавит эндпоинт:
// DTO -> types/api.ts, маппер -> mappers.ts, здесь ветка `if (!USE_MOCKS)`.

import type {
  SellerApplication,
  SellerApplicationRequest,
} from "../../types/sellerApplication";

const FAKE_DELAY_MS = 800;
const STORAGE_KEY = "treba_demo_seller_applications";

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readAll(): SellerApplication[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SellerApplication[]) : [];
  } catch {
    // повреждённые данные — считаем, что заявок нет
    return [];
  }
}

function writeAll(all: SellerApplication[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // хранилище недоступно — заявка живёт до перезагрузки
  }
}

/** Отправить заявку. Ошибки — с готовым текстом для UI */
export async function submitSellerApplication(
  request: SellerApplicationRequest
): Promise<SellerApplication> {
  await wait(FAKE_DELAY_MS);

  const all = readAll();
  const email = request.email.toLowerCase();

  if (all.some((application) => application.email.toLowerCase() === email)) {
    throw new Error(
      "Заявку з цим email уже надіслано. Менеджер зв'яжеться з вами найближчим часом."
    );
  }

  const application: SellerApplication = {
    ...request,
    id: crypto.randomUUID(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  writeAll([...all, application]);
  return application;
}