<script setup lang="ts">
import CopyButton from '@/components/atoms/CopyButton.vue'

// Citation text for the CellML Model Repository.
const citationText =
  'Lloyd, C.M., Lawson, J.L., Hunter, P.J. and Nielsen, P.F. The CellML Model Repository. Bioinformatics. 2008 September;24(18):2122-2123.'
</script>

<template>
  <p>
    Registered users are free to upload any model file, and associated data (such as images, experimental data,
    simulation data, session files, etc.).
    However, the repository curators reserve the right to remove any inappropriate material from the repository.
  </p>

  <h3>Referencing the CellML Model Repository</h3>
  <p>
    To reference the CellML model repository please cite the following publication:
  </p>

  <div class="group relative mt-4">
    <code>
      {{ citationText }}
    </code>
    <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <CopyButton
        :text="citationText"
        title="Copy citation"
      />
    </div>
  </div>

  <h3>Referencing Specific Models</h3>
  <p>
    To reference a specific model in the CellML model repository, please cite:
  </p>

  <ul>
    <li>
      the model name (usually based on the title of the original published paper, the authors' names and the publication date);
    </li>
    <li>
      the URL of the model exposure;
    </li>
    <li>
      the time and date on which you downloaded the model file;
    </li>
    <li>
      and the authors of the CellML model.
    </li>
  </ul>

  <p>
    For example:
  </p>
  <p>
    <code>
      Can yeast glycolysis be understood in terms of in vitro kinetics of the constituent enzymes? Testing biochemistry.
      Teusink et al. 2000. https://models.physiomeproject.org/e/72/
      9.15am 31st January 2010
      CellML author(s): Catherine Lloyd
    </code>
  </p>

  <h3>Referencing Specific Figures</h3>

  <p>
    To reference a specific figure in the CellML model repository, please cite:
  </p>

  <ul>
    <li>
      the figure name (usually based on the title of the original published paper, the authors' names and the publication date);
    </li>
    <li>
      the URL of the figure;
    </li>
    <li>
      and the figure creators.
    </li>
  </ul>

  <p>
    For example:
  </p>
  <p>
    <code>
      Can yeast glycolysis be understood in terms of in vitro kinetics of the constituent enzymes? Testing biochemistry.
      Teusink et al. 2000.
      https://models.physiomeproject.org/e/72/teusink_2000.png
      Figure creators: Pulasthi Mithraratne, Peter Villiger, Linda Feng and Hanne Nielsen.
    </code>
  </p>
</template>

<style scoped>
@reference 'tailwindcss';
@reference '@/assets/main.css';

code {
  @apply block text-sm! m-0! p-4 pr-8 bg-gray-50 dark:bg-gray-800 rounded-md;
}

h3 {
  @apply text-lg font-semibold mt-6 mb-2;
}

p + p,
p + ul,
ul + p {
  @apply mt-4;
}

ul {
  @apply list-disc list-inside mb-4 pl-4;
}

li {
  @apply mb-1;
}
</style>
