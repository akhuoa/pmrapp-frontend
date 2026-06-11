<template>
  <p>
    Registered users are free to upload any model file, and associated data (such as images, experimental data,
    simulation data, session files, etc.).
    However, the repository curators reserve the right to remove any inappropriate material from the repository.
  </p>

  <p>
    To reference the CellML model repository please cite the following publication:
  </p>

  <p>
    <code>
      Lloyd, C.M., Lawson, J.L., Hunter, P.J. and Nielsen, P.F. The CellML Model Repository. Bioinformatics. 2008 September;24(18):2122-2123.
    </code>
  </p>

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
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  @apply block p-2 bg-gray-200 dark:bg-gray-900 rounded overflow-x-auto text-sm! m-0! transition-all duration-200 ease-in-out;
}
</style>
