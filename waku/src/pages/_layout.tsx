import '../styles.css';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <title>Waku TODO</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {children}
    </>
  );
}

export const getConfig = async () => {
  return {
    render: 'dynamic',
  } as const;
};
