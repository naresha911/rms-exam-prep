-- Inline SVG figures for AI-generated diagram questions.
--
-- The generator draws figures as SVG markup. The sync now writes that markup as
-- text next to the existing image-path columns, so no storage bucket is needed
-- for generated diagrams. The *_path columns stay for cropped / raster figures.

alter table "public"."questions"
  add column if not exists "diagram_svg" "text";

alter table "public"."question_translations"
  add column if not exists "explanation_diagram_svg" "text";

alter table "public"."question_groups"
  add column if not exists "shared_image_svg" "text";

alter table "public"."option_translations"
  add column if not exists "option_svg" "text";

-- An option now also counts as filled when it carries inline SVG instead of text
-- or an image path.
alter table "public"."option_translations"
  drop constraint if exists "option_has_content";

alter table "public"."option_translations"
  add constraint "option_has_content"
  check (
    ("option_text" is not null)
    or ("option_image_path" is not null)
    or ("option_svg" is not null)
  );
