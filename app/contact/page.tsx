"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-16 sm:py-20">
      <div className="container mx-auto px-4 max-w-5xl space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="rounded-full bg-orange-100 px-4 py-1 text-xs font-bold uppercase tracking-wider text-orange-600">
            Get In Touch
          </span>
          <h1 className="mt-3 text-4xl font-black text-slate-900 sm:text-5xl">
            We&apos;d Love to Hear From You
          </h1>
          <p className="mt-2 text-base text-slate-500">
            Have questions about catering, private parties, or our ingredients? Reach out to our friendly crew anytime.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Info cards (1 col) */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase text-slate-400">
                    Phone & WhatsApp
                  </h3>
                  <p className="font-bold text-slate-900 text-sm">
                    +20 100 011 2233
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase text-slate-400">
                    Email Support
                  </h3>
                  <p className="font-bold text-slate-900 text-sm">
                    support@pizzadashboard.com
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase text-slate-400">
                    Main Kitchen
                  </h3>
                  <p className="font-bold text-slate-900 text-sm">
                    15 El Nasr Street, Cairo, Egypt
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase text-slate-400">
                    Opening Hours
                  </h3>
                  <p className="font-bold text-slate-900 text-sm">
                    Daily: 11:00 AM – 02:00 AM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form (2 cols) */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm lg:col-span-2">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="mt-4 text-2xl font-black text-slate-900">
                  Message Sent Successfully!
                </h3>
                <p className="mt-2 text-sm text-slate-500 max-w-sm">
                  Thank you for reaching out. A member of our team will get back to you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", subject: "", message: "" });
                  }}
                  className="mt-6 rounded-2xl border border-slate-200 px-6 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-xl font-black text-slate-900 mb-6">
                  Send Us a Direct Message
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-700">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, name: e.target.value }))
                      }
                      placeholder="John Doe"
                      className="mt-1 w-full rounded-2xl border border-slate-200 p-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, email: e.target.value }))
                      }
                      placeholder="john@example.com"
                      className="mt-1 w-full rounded-2xl border border-slate-200 p-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, subject: e.target.value }))
                    }
                    placeholder="Feedback, Catering inquiry, etc."
                    className="mt-1 w-full rounded-2xl border border-slate-200 p-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, message: e.target.value }))
                    }
                    placeholder="Tell us what's on your mind..."
                    className="mt-1 w-full rounded-2xl border border-slate-200 p-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-2xl bg-orange-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-600/30 transition hover:bg-orange-700 cursor-pointer"
                  >
                    <Send size={16} />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
