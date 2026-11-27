"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { StoreSettings } from "@/lib/admin-dashboard-storage";

type Props = {
  settings: StoreSettings;
  onSave: (settings: StoreSettings) => boolean;
};

export default function AdminStoreSettingsPanel({ settings, onSave }: Props) {
  const [draft, setDraft] = useState(settings);
  const [saved, setSaved] = useState(false);

  const update = (field: keyof StoreSettings, value: string) => {
    setSaved(false);
    setDraft((current) => ({ ...current, [field]: value }));
  };

  return (
    <section aria-labelledby="settings-heading" className="flex flex-col gap-6">
      <div>
        <h2 id="settings-heading" className="text-xl font-semibold tracking-tight sm:text-2xl">Store Settings</h2>
        <p className="mt-1 text-sm text-neutral-600">Update the storefront details shown in this browser-only demo.</p>
      </div>

      <form
        className="flex max-w-3xl flex-col gap-5 border border-neutral-200 bg-white p-4 sm:p-6"
        onSubmit={(event) => {
          event.preventDefault();
          setSaved(onSave(draft));
        }}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium">
            Store Location
            <Input
              value={draft.location}
              onChange={(event) => update("location", event.target.value)}
              autoComplete="street-address"
              className="h-11 rounded-sm border-neutral-300 text-sm shadow-none focus-visible:ring-[#0A0A0A]"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Store Hours
            <Input
              value={draft.hours}
              onChange={(event) => update("hours", event.target.value)}
              className="h-11 rounded-sm border-neutral-300 text-sm shadow-none focus-visible:ring-[#0A0A0A]"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium sm:col-span-2">
            WhatsApp Number
            <Input
              type="tel"
              value={draft.whatsappNumber}
              onChange={(event) => update("whatsappNumber", event.target.value)}
              autoComplete="tel"
              inputMode="tel"
              className="h-11 rounded-sm border-neutral-300 text-sm shadow-none focus-visible:ring-[#0A0A0A]"
              required
            />
            <span className="text-xs font-normal text-neutral-500">Use the international format, for example 254712345678.</span>
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium sm:col-span-2">
            Top Announcement Banner
            <Textarea
              value={draft.announcement}
              onChange={(event) => update("announcement", event.target.value)}
              rows={3}
              maxLength={180}
              className="resize-y rounded-sm border-neutral-300 text-sm shadow-none focus-visible:ring-[#0A0A0A]"
              placeholder="Add a short message for the storefront announcement bar"
            />
            <span className="text-xs font-normal text-neutral-500">Up to 180 characters. This saved demo setting does not yet update the live storefront.</span>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-neutral-200 pt-5">
          <Button
            type="submit"
            className="rounded-sm bg-[#0A0A0A] px-5 text-sm text-white shadow-none hover:bg-neutral-800"
          >
            Save Changes
          </Button>
          {saved && <span className="text-sm text-neutral-600" role="status">Saved in this browser.</span>}
        </div>
      </form>
    </section>
  );
}
