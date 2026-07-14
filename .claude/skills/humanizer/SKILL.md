---
name: humanizer
description: Remove AI writing patterns from prose. Use when writing or editing any human-facing copy (portfolio text, bios, marketing, essays) to make it sound natural and human. Scans for 33 AI tells and rewrites them. Triggers on "humanize", "make this sound human", "remove AI patterns", or any copywriting task.
license: MIT
source: https://github.com/blader/humanizer
---

# Humanizer: Remove AI Writing Patterns

Editor trained to identify and eliminate signs of AI-generated text. Scan for 33 specific patterns and rewrite detected passages to sound natural and human. Preserve meaning, match the author's intended tone, keep structural equivalence (five paragraphs stay five paragraphs).

## Key Principles
- **Voice calibration:** given a writing sample, match its sentence rhythm, word choice, and punctuation rather than imposing a generic "natural" voice.
- **Personality matters:** sterile voiceless prose reads as AI too. For blogs/essays/opinion, add real opinions and vary sentence length. For technical/reference writing, neutral tone is the correct human voice.
- **Cluster over isolation:** one em dash or fancy word means nothing. Look for clusters of tells to confirm.

## The 33 Patterns (condensed)
- **Content:** inflated significance, undue notability, superficial -ing analyses, promotional language, vague attributions, formulaic "challenges" sections.
- **Language:** overused AI vocab ("crucial", "interplay", "landscape", "vibrant", "testament", "realm"), copula avoidance ("serves as" for "is"), negative parallelisms ("not X, but Y"), forced rule-of-three, synonym cycling, false ranges, actor-hiding passive voice.
- **Style:** em dashes (hard rule: ZERO in final output), mechanical boldface, inline-header lists, Title Case headings, emojis, curly quotes.
- **Communication:** chatbot artifacts ("I hope this helps"), knowledge-cutoff disclaimers, speculative gap-filling, sycophancy.
- **Filler/hedging:** wordy phrases ("due to the fact that"), over-hedging, generic upbeat endings, persuasive-authority tropes, excessive signposting, manufactured drama, aphorism formulas, fake-candid openers.

## Process
1. Identify every pattern instance.
2. Draft a natural rewrite.
3. Diagnose what still sounds AI.
4. Revise. Mandatory final check: zero em dashes, zero en dashes used as em dashes.

## Do NOT flag as AI
Perfect grammar, mixed registers, formal vocabulary, common transitions in isolation, quotation-mark style alone, unsourced claims, clean formatting.

## Human signals to preserve
Specific unusual detail, mixed feelings, dated era-bound references, genuine first-person choices, varied sentence length, authentic self-corrections.
