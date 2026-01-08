export const metadata = {
  title: "One Rule",
  description: "One serious rule per day. No noise."
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, backgroundColor: "#fff", color: "#000" }}>
        {children}
      </body>
    </html>
  );
}
