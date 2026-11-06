import { normalizeText } from '../normalize';
import type { Signal } from '../types';
import {
  CONTACT_OFFSITE,
  CREDENTIAL_REQUEST,
  IMPERSONATED_BRANDS,
  JOB_OFFER,
  MONEY_REQUEST,
  OTP_REFUSAL,
  OTP_REQUEST,
  PRIZE,
  TAGLISH_URGENCY,
  THREAT,
  URGENCY,
  VERIFY_DEMAND,
} from '../lexicons';

function makeSignal(
  id: string,
  severity: Signal['severity'],
  weight: number,
  title: string,
  detail: string,
  evidence?: string,
): Signal {
  return { id, category: 'text', severity, weight, title, detail, evidence };
}

function firstMatch(text: string, pattern: RegExp): string | undefined {
  return text.match(pattern)?.[0];
}

export function detectTextSignals(text: string): Signal[] {
  const normalized = normalizeText(text);
  if (!normalized) return [];

  const signals: Signal[] = [];
  const add = (signal: Signal) => signals.push(signal);

  if (OTP_REQUEST.test(normalized) && !OTP_REFUSAL.test(normalized)) {
    add(
      makeSignal(
        'text.otp_request',
        'critical',
        30,
        'Hinihingi ang OTP o PIN mo',
        'Hindi kailanman hinihingi ng bank ang OTP mo sa text o tawag.',
        firstMatch(normalized, OTP_REQUEST),
      ),
    );
  }

  if (CREDENTIAL_REQUEST.test(normalized)) {
    add(
      makeSignal(
        'text.credential_request',
        'critical',
        30,
        'Hinihingi ang password o card details',
        'Wala ring legitimate na bank ang humihingi ng password o CVV sa text.',
        firstMatch(normalized, CREDENTIAL_REQUEST),
      ),
    );
  }

  if (PRIZE.test(normalized)) {
    add(
      makeSignal(
        'text.prize',
        'high',
        25,
        'Premyo o raffle na pinapa-claim',
        'Karaniwang pang-akit ito para mag-click o magbigay ng impormasyon.',
        firstMatch(normalized, PRIZE),
      ),
    );
  }

  if (MONEY_REQUEST.test(normalized)) {
    add(
      makeSignal(
        'text.money_request',
        'high',
        20,
        'May hihingin na pera o load',
        'Advance-fee scam: kailangan mo munang magbayad para makuha ang premyo o serbisyo.',
        firstMatch(normalized, MONEY_REQUEST),
      ),
    );
  }

  if (IMPERSONATED_BRANDS.test(normalized) && VERIFY_DEMAND.test(normalized)) {
    add(
      makeSignal(
        'text.impersonation',
        'high',
        20,
        'Nagpapanggap na bank o ahensya',
        'Ginagamit ang pangalan ng kilalang institusyon para magmukhang lehitimo.',
        firstMatch(normalized, IMPERSONATED_BRANDS),
      ),
    );
  }

  if (THREAT.test(normalized)) {
    add(
      makeSignal(
        'text.threat',
        'medium',
        15,
        'Pananakot na i-deactivate ang account',
        'Ginagamit ang takot para magmadali ka at hindi na mag-isip.',
        firstMatch(normalized, THREAT),
      ),
    );
  }

  if (JOB_OFFER.test(normalized)) {
    add(
      makeSignal(
        'text.job_offer',
        'medium',
        18,
        'Offer na kumita agad',
        'Maraming job scam ang nangangako ng malaking kita pero may bayad o walang trabaho.',
        firstMatch(normalized, JOB_OFFER),
      ),
    );
  }

  if (URGENCY.test(normalized)) {
    add(
      makeSignal(
        'text.urgency',
        'medium',
        12,
        'Pinapamadali ka',
        'Karaniwang taktika ito para hindi ka na mag-verify.',
        firstMatch(normalized, URGENCY),
      ),
    );
  }

  if (CONTACT_OFFSITE.test(normalized)) {
    add(
      makeSignal(
        'text.contact_offsite',
        'low',
        8,
        'Nasa labas ng platform ang contact',
        'Mas mahirap i-trace ang scammer kapag sa Telegram o Viber ang usapan.',
        firstMatch(normalized, CONTACT_OFFSITE),
      ),
    );
  }

  if (TAGLISH_URGENCY.test(normalized)) {
    add(
      makeSignal(
        'text.taglish_urgency',
        'low',
        6,
        'Taglish na pagmamadali',
        'Ginagamit ang "agad" o "ngayon na" para mapabilis ang desisyon mo.',
        firstMatch(normalized, TAGLISH_URGENCY),
      ),
    );
  }

  return signals;
}
