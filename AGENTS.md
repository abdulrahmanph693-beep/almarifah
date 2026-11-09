<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Generate editorial cover images only through an authenticated admin-only server function; save accepted crops in the existing `submissions.cover_image` field to preserve the current public-work data flow.
- Account listing and changes use authenticated server functions with a fresh server-side admin-role check before privileged Auth or role operations, so browser state cannot grant account privileges.
