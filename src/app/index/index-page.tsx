import { Button } from "lib/shared/ui";

export function IndexPage() {
  return (
    <div>
      <p>Index page</p>
      <Button as="link" to="/login">
        ログイン
      </Button>
    </div>
  );
}
