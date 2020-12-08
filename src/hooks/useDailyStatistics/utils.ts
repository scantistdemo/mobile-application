import { chain, sumBy } from "lodash";
import { DailyStatistics, CampaignPolicy } from "../../types";
import { formatQuantityText } from "../../components/CustomerQuota/utils";
import { Sentry } from "../../utils/errorTracking";
import { i18ntWithValidator } from "../useTranslate/useTranslate";

type SummarisedTransactions = {
  summarisedTransactionHistory: {
    name: string;
    category: string;
    quantityText: string;
    descriptionAlert?: string;
    order: number;
  }[];
  summarisedTotalCount: number;
};

export const countTotalTransactionsAndByCategory = (
  transactions: DailyStatistics[],
  policies: CampaignPolicy[] | null,
  c13ntForUnit: (
    unit: CampaignPolicy["quantity"]["unit"]
  ) => CampaignPolicy["quantity"]["unit"]
): SummarisedTransactions => {
  return chain(transactions)
    .groupBy("category")
    .reduce<SummarisedTransactions>(
      (prev, transactionsByCategory, key) => {
        const findItemByCategory = policies?.find(
          (item) => item.category === key
        );
        const totalQuantityInCategory = sumBy(
          transactionsByCategory,
          "quantity"
        );
        prev.summarisedTransactionHistory.push({
          name:
            findItemByCategory?.name ??
            (() => {
              Sentry.captureException(
                `Unable to find item category in policies: ${key}}`
              );
              return key;
            })(),
          category: key,

          quantityText: formatQuantityText(
            totalQuantityInCategory,
            c13ntForUnit(findItemByCategory?.quantity.unit) || {
              type: "POSTFIX",
              label: ` ${i18ntWithValidator(
                "checkoutSuccessScreen",
                "quantity"
              )}`,
            }
          ),

          descriptionAlert:
            findItemByCategory?.categoryType === "APPEAL"
              ? i18ntWithValidator("redemptionStats", "viaAppeal")
              : undefined,
          order: findItemByCategory?.order ?? -1,
        });
        prev.summarisedTotalCount += totalQuantityInCategory;
        return prev;
      },
      { summarisedTransactionHistory: [], summarisedTotalCount: 0 }
    )
    .value();
};
