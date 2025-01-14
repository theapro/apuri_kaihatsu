"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { Link, useRouter } from "@/navigation";
import { useMakeZodI18nMap } from "@/lib/zodIntl";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import NotFound from "@/components/NotFound";
import useApiQuery from "@/lib/useApiQuery";
import Parent from "@/types/parent";
import useApiMutation from "@/lib/useApiMutation";

const formSchema = z.object({
  given_name: z.string().min(1).max(50),
  family_name: z.string().min(1).max(50),
  phone_number: z.string().min(10).max(500),
});

export default function EditParent({
  params: { parentId },
}: {
  params: { parentId: string };
}) {
  const zodErrors = useMakeZodI18nMap();
  z.setErrorMap(zodErrors);
  const t = useTranslations("EditParent");
  const tName = useTranslations("names");
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      given_name: "",
      family_name: "",
      phone_number: "",
    },
  });
  const { data, isLoading, isError } = useApiQuery<{
    parent: Parent;
  }>(`parent/${parentId}`, ["parent", parentId]);
  const { isPending, mutate } = useApiMutation<{ parent: Parent }>(
    `parent/${parentId}`,
    "PUT",
    ["editParent", parentId],
    {
      onSuccess: (data) => {
        toast({
          title: t("ParentUpdated"),
          description: tName("name", { ...data?.parent }),
        });
        form.reset();
        router.push("/parents");
      },
    }
  );

  useEffect(() => {
    if (data) {
      form.setValue("given_name", data.parent.given_name);
      form.setValue("family_name", data.parent.family_name);
      form.setValue("phone_number", data.parent.phone_number);
    }
  }, [data, form]);

  if (isError) return <NotFound />;

  return (
    <div className="w-full space-y-8">
      <div className="flex justify-between">
        <h1 className="text-3xl w-2/4 font-bold">{t("EditParent")}</h1>
        <Link href={`/parents`}>
          <Button variant={"secondary"}>{t("back")}</Button>
        </Link>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => mutate(values as any))}
          className="space-y-4"
        >
          <div className="flex w-full">
            <div className="w-full space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="given_name"
                  render={({ field, formState }) => (
                    <FormItem>
                      <FormLabel>{t("ParentName")}</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          placeholder={t("ParentName")}
                          type="text"
                        />
                      </FormControl>
                      <FormMessage>
                        {formState.errors.given_name &&
                          "Parent name is required. Parent name should be more than 5 characters"}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="family_name"
                  render={({ field, formState }) => (
                    <FormItem>
                      <FormLabel>{t("ParentFamilyName")}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t("ParentFamilyName")}
                          type="text"
                        />
                      </FormControl>
                      <FormMessage>
                        {formState.errors.family_name &&
                          "Parent family name is required. Parent family name should be more than 5 characters"}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone_number"
                render={({ field, formState }) => (
                  <FormItem>
                    <FormLabel>{t("ParentPhone")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("ParentPhone")}
                        type="tel"
                      />
                    </FormControl>
                    <FormMessage>
                      {formState.errors.phone_number &&
                        "Parent phone number is required. Parent phone number should be more than 10 characters"}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                <Button disabled={isPending || isLoading}>
                  {t("EditParent") + (isPending ? "..." : "")}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
