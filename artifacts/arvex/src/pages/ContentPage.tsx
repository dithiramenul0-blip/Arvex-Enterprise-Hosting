import { useGetContent, getGetContentQueryKey } from "@workspace/api-client-react";
import { Navbar, Footer } from "@/components/Layout";
import { PageTransition } from "@/components/PageTransition";

export default function ContentPage({ slug }: { slug: string }) {
  const { data: page, isLoading } = useGetContent(slug, {
    query: {
      enabled: !!slug,
      queryKey: getGetContentQueryKey(slug)
    }
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <PageTransition>
            {isLoading ? (
               <div className="flex justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
            ) : page ? (
              <div className="glass-panel p-8 md:p-12 rounded-2xl">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">{page.title}</h1>
                <div className="prose prose-invert prose-red max-w-none">
                  {/* In a real app this would use a markdown or HTML renderer */}
                  <div dangerouslySetInnerHTML={{ __html: page.content.replace(/\n/g, '<br/>') }} />
                </div>
                <div className="mt-12 text-sm text-muted-foreground">
                  Last updated: {new Date(page.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ) : (
              <div className="text-center text-white">Page not found.</div>
            )}
          </PageTransition>
        </div>
      </main>
      <Footer />
    </div>
  );
}
